import * as Kola from 'kola-signals';
import { Comparator } from './comparator';
import { TableModel } from './table_model';
import {
  AddRowOperation, MoveRowOperation, Operation,
  RemoveRowOperation, UpdateValueOperation
} from './operations';
import { TranslatedTableModel } from './translated_table_model';
import { timingSafeEqual } from 'crypto';

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
    if (this._sortOrder === SortOrder.ASCENDING) {
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
    this.originalTable = source;
    const rowOrdering = [];
    for (let index = 0; index < source.rowCount; ++index) {
      rowOrdering.push(index);
    }
    this.rowTransltion = rowOrdering;
    if (comparator) {
      this.compaerer = comparator;
    }
    if (columnOrder !== undefined) {
      this.order = columnOrder;
      this.sort(source);
    } else {
      this.order = [];
    }
  }

  /** Marks the beginning of a transaction. In cases where a transaction is
   *  already being processed, then the sub-transaction gets consolidated into
   *  the parent transaction.
   */
  public beginTransaction(): void {
    if (this.transactionCount === 0) {
      this.operations = [];
    }
    ++this.transactionCount;
  }

  /** Ends a transaction. */
  public endTransaction(): void {
    --this.transactionCount;
    if (this.transactionCount === 0) {
      this.dispatcher.dispatch(this.operations);
    }
  }

  /** Returns the column sort order. */
  public get columnOrder(): ColumnOrder[] {
    return this.order;
  }

  /** Sets the order that the columns are sorted by. */
  public set columnOrder(columnOrder: ColumnOrder[]) {
    this.order = columnOrder;
  }

  public get rowCount(): number {
    return this.originalTable.rowCount;
  }

  public get columnCount(): number {
    return this.originalTable.columnCount;
  }

  public get(row: number, column: number): any {
    return this.originalTable.get(this.rowTransltion[row], column);
  }

  public connect(slot: (operations: Operation[]) => void):
    Kola.Listener<Operation[]> {
    return this.dispatcher.listen(slot);
  }

  public compareRows(row1: number, row2: number): number {
    for (let index = 0; index < 1; ++index) {
      const value = this.compaerer.compareValues(
        this.originalTable.get(row1, this.order[index].index),
        this.originalTable.get(row2, this.order[index].index));
      if (value !== 0) {
        if (this.order[index].sortOrder === SortOrder.ASCENDING) {
          return value;
        } else {
          return value * -1;
        }
      }
    }
    return 0;
  }

  private handleOperations(newOperations: Operation[]): void {
    this.beginTransaction();
    for (const operation of newOperations) {
      if (operation instanceof AddRowOperation) {
      } else if (operation instanceof RemoveRowOperation) {
      } else if (operation instanceof UpdateValueOperation) {
      } else {
        throw TypeError();
      }
    }
    this.endTransaction();
  }

  private sort(tableMode: TableModel): void {
    const rowOrdering = [];
    for (let index = 0; index < tableMode.rowCount; ++index) {
      rowOrdering.push(index);
    }
    rowOrdering.sort(
      (row1, row2) => {
        for (let index = 0; index < this.order.length; ++index) {
          const value = this.compaerer.compareValues(
            this.originalTable.get(row1, this.order[index].index),
            this.originalTable.get(row2, this.order[index].index));
          if (value !== 0) {
            if (this.order[index].sortOrder === SortOrder.ASCENDING) {
              return value;
            } else {
              return value * -1;
            }
          }
        }
        return 0;
      });
    console.log(rowOrdering);
    this.rowTransltion = rowOrdering;
  }

  private originalTable: TableModel;
  private rowTransltion: number[];
  private compaerer: Comparator;
  private order: ColumnOrder[];
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
