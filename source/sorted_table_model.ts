import * as Kola from 'kola-signals';
import { Comparator } from './comparator';
import { TableModel } from './table_model';
import { Operation } from './operations';
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
      this.order = columnOrder.slice();
    } else {
      this.order = [];
    }
    this.sort(source);
  }

  /** Returns the column sort order. */
  public get columnOrder(): ColumnOrder[] {
    return this.order.slice();
  }

  /** Sets the order that the columns are sorted by. */
  public set columnOrder(columnOrder: ColumnOrder[]) {
    this.order = columnOrder.slice();
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

  private sort(tableModel: TableModel) {
    const rowOrdering = [];
    for(let i = 0; i < tableModel.rowCount; ++i) {
      rowOrdering.push(i);
    }
    rowOrdering.sort((a, b) => this.compareRows(a, b));
    for(let i = 0; i < rowOrdering.length - 1; ++i) {
      this.translatedTable.moveRow(rowOrdering[i], i);
      for(let j = i + 1; j < rowOrdering.length; ++j) {
        if(rowOrdering[j] <= rowOrdering[i]) {
          ++rowOrdering[j];
        }
      }
    }
  }

  private compareRows(row1: number, row2: number) {
    for(let i = 0; i < this.order.length; ++i) {
      const value = this.comparator.compareValues(
        this.translatedTable.get(row1, this.order[i].index),
        this.translatedTable.get(row2, this.order[i].index));
      if(value !== 0) {
        if(this.order[i].sortOrder === SortOrder.ASCENDING) {
          return value;
        } else {
          return -value;
        }
      }
    }
    return 0;
  }

  private translatedTable: TranslatedTableModel;
  private comparator: Comparator;
  private order: ColumnOrder[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
