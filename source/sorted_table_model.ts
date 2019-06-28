import * as Kola from 'kola-signals';
import { Comparator } from './comparator';
import { TableModel } from './table_model';
import { AddRowOperation, Operation, RemoveRowOperation, UpdateValueOperation } from './operations';
import { TranslatedTableModel } from './translated_table_model';

/** Specifies whether to sort in ascending order or descending order. */
export enum SortOrder {

  /** Items are sorted in increasing order. */
  ASCENDING,

  /** Items are sorted in decreasing order. */
  DESCENDING
}

/** Specifies a column's sort order. */
export class ColumnOrder {

  /** Constructs a ColumnOrder.
   * @param index - The column.
   * @param sortOrder - Whether the column is ordered in ascending or descending
   *        order.
   */
  constructor(index: number, sortOrder: SortOrder = SortOrder.ASCENDING) {
    this._index = index;
    this._sortOrder = sortOrder;
  }

  /** Returns the column's index. */
  public get index(): number {
    return this._index;
  }

  /** Returns the column's sort order. */
  public get sortOrder(): SortOrder {
    return this._sortOrder;
  }

  /** Returns a new ColumnOrder with a reversed sort order. */
  public reverseSortOrder(): ColumnOrder {
    if(this._sortOrder === SortOrder.ASCENDING) {
      return new ColumnOrder(this._index, SortOrder.DESCENDING);
    } else {
      return new ColumnOrder(this._index, SortOrder.ASCENDING);
    }
  }

  private _index: number;
  private _sortOrder: SortOrder;
}

/** Implements a TableModel that maintains its rows in sorted order.
 *  A Comparator is used to test the order of individual values and a column
 *  sort order is used to break ties between two values with the same ordering.
 *  Any column not explicitly specified in the column sort order will be
 *  sorted in an indeterminant manner.
 */
export class SortedTableModel extends TableModel {

  /** Constructs a SortedTableModel.
   * @param source - The underlying model to sort.
   * @param comparator - The comparator used.
   * @param columnOrder - The column sort order.
   */
  public constructor(source: TableModel, comparator?: Comparator,
      columnOrder?: ColumnOrder[]) {
    super();
    this.translatedTable = new TranslatedTableModel(source);
    if(comparator) {
      this.comparator = comparator;
    } else {
      this.comparator = new Comparator();
    }
    if(columnOrder) {
      this._columnOrder = columnOrder.slice();
    } else {
      this._columnOrder = [];
    }
    this.sort();
    this.transactionCount = 0;
    this.operations = [];
    this.dispatcher = new Kola.Dispatcher<Operation[]>();
    this.translatedTable.connect(this.handleOperations.bind(this));
  }

  /** Marks the beginning of a transaction. In cases where a transaction is
   *  already being processed, then the sub-transaction gets consolidated into
   *  the parent transaction.
   */
  public beginTransaction(): void {
    if(this.transactionCount === 0) {
      this.operations = [];
    }
    ++this.transactionCount;
  }

  /** Ends a transaction. */
  public endTransaction(): void {
    --this.transactionCount;
    if(this.transactionCount === 0) {
      this.dispatcher.dispatch(this.operations);
    }
  }

  /** Returns the column sort order. */
  public get columnOrder(): ColumnOrder[] {
    return this._columnOrder.slice();
  }

  /** Sets the order that the columns are sorted by. */
  public set columnOrder(columnOrder: ColumnOrder[]) {
    this._columnOrder = columnOrder.slice();
    this.sort();
  }

  public get rowCount(): number {
    return this.translatedTable.rowCount;
  }

  public get columnCount(): number {
    return this.translatedTable.columnCount;
  }

  public get(row: number, column: number): any {
    return this.translatedTable.get(row, column);
  }

  public connect(slot: (operations: Operation[]) => void):
      Kola.Listener<Operation[]> {
    return this.dispatcher.listen(slot);
  }

  private handleOperations(newOperations: Operation[]): void {
    this.beginTransaction();
    for(const operation of newOperations) {
      if(operation instanceof AddRowOperation) {
        this.rowAdded(operation);
      } else if(operation instanceof RemoveRowOperation) {
        this.operations.push(
          new RemoveRowOperation(operation.index, operation.row));
      } else if(operation instanceof UpdateValueOperation) {
        this.rowUpdated(operation);
      }
    }
    this.endTransaction();
  }

  private sort() {
    const rowOrdering = [];
    for(let i = 0; i < this.translatedTable.rowCount; ++i) {
      rowOrdering.push(i);
    }
    rowOrdering.sort((a, b) => this.compareRows(a, b));
    for(let i = 0; i < rowOrdering.length; ++i) {
      this.translatedTable.moveRow(rowOrdering[i], i);
      for(let j = i + 1; j < rowOrdering.length; ++j) {
        if(rowOrdering[j] < rowOrdering[i]) {
          ++rowOrdering[j];
        }
      }
    }
  }

  private compareRows(row1: number, row2: number) {
    for(let i = 0; i < this._columnOrder.length; ++i) {
      const value = this.comparator.compareValues(
        this.translatedTable.get(row1, this._columnOrder[i].index),
        this.translatedTable.get(row2, this._columnOrder[i].index));
      if(value !== 0) {
        if(this._columnOrder[i].sortOrder === SortOrder.ASCENDING) {
          return value;
        } else {
          return -value;
        }
      }
    }
    return 0;
  }

  private rowAdded(operation: AddRowOperation) {
    this.beginTransaction();
    const rowAddedIndex = operation.index;
    const leftIndex = (() => {
      if(rowAddedIndex === 0) {
        return rowAddedIndex;
      } else {
        return rowAddedIndex - 1;
      }
    })();
    const rightIndex = (() => {
      if(rowAddedIndex === this.translatedTable.rowCount - 1 ) {
        return rowAddedIndex;
      } else {
        return rowAddedIndex + 1;
      }
    })();
    let destination = rowAddedIndex;
    if(this.compareRows(leftIndex, rowAddedIndex) > 0) {
      destination = this.findIndex(0, leftIndex, rowAddedIndex);
    } else if(this.compareRows(rowAddedIndex, rightIndex) > 0) {
      destination = this.findIndex(rightIndex,
        this.translatedTable.rowCount - 1, rowAddedIndex);
    }
    this.translatedTable.moveRow(rowAddedIndex, destination);
    this.operations.push(new AddRowOperation(destination, operation.row));
    this.endTransaction();
  }

  private rowUpdated(operation: UpdateValueOperation) {
    this.beginTransaction();
    const rowUpdatedIndex = operation.row;
    const leftIndex = (() => {
      if(rowUpdatedIndex === 0) {
        return rowUpdatedIndex;
      } else {
        return rowUpdatedIndex - 1;
      }
    })();
    const rightIndex = (() => {
      if(rowUpdatedIndex === this.translatedTable.rowCount - 1 ) {
        return rowUpdatedIndex;
      } else {
        return rowUpdatedIndex + 1;
      }
    })();
    let destination = rowUpdatedIndex;
    if(this.compareRows(leftIndex, rowUpdatedIndex) > 0) {
      destination = this.findIndex(0, leftIndex, rowUpdatedIndex);
    } else if(this.compareRows(rowUpdatedIndex, rightIndex) > 0) {
      destination = this.findIndex(rightIndex,
        this.translatedTable.rowCount - 1, rowUpdatedIndex);
    }
    this.translatedTable.moveRow(rowUpdatedIndex, destination);
    this.operations.push(
      new UpdateValueOperation(
        destination, operation.column, operation.previous, operation.current));
    this.endTransaction();
  }

  private findIndex(start: number, end: number, index: number): number {
    if(start === end) {
      return start;
    }
    const mid = Math.floor((start + end) / 2);
    if(start < mid) {
      if(this.compareRows(mid - 1, index) > 0) {
        return(this.findIndex(start, mid - 1, index));
      }
    }
    if(mid < end) {
      if(this.compareRows(index, mid) > 0) {
        return(this.findIndex(mid + 1, end, index));
      }
    }
    return mid;
  }

  private translatedTable: TranslatedTableModel;
  private comparator: Comparator;
  private _columnOrder: ColumnOrder[];
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
