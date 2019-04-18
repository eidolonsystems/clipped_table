import * as Kola from 'kola-signals';
import { Comparator } from './comparator';
import { TableModel } from './table_model';
import { Operation } from './operations';

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
    this.index = index;
    this.order = sortOrder;
  }

  /** Returns the column's index. */
  public get index(): number {
    return this.index;
  }

  /** Returns the column's sort order. */
  public get sortOrder(): SortOrder {
    return this.order;
  }

  /** Returns a new ColumnOrder with a reversed sort order. */
  public reverseSortOrder(): ColumnOrder {
    if(this.order === SortOrder.ASCENDING) {
      return new ColumnOrder(this.index, SortOrder.DESCENDING);
    } else {
      return new ColumnOrder(this.index, SortOrder.ASCENDING);
    }
  }

  private index: number;
  private order: SortOrder;
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
  }

  /** Returns the column sort order. */
  public get columnOrder(): ColumnOrder[] {
    return null;
  }

  /** Sets the order that the columns are sorted by. */
  public set columnOrder(columnOrder: ColumnOrder[]) {}

  public get rowCount(): number {
    return 0;
  }

  public get columnCount(): number {
    return 0;
  }

  public get(row: number, column: number): any {
    return null;
  }

  public connect(slot: (operations: Operation[]) => void):
      Kola.Listener<Operation[]> {
    return null;
  }
}
