import * as Kola from 'kola-signals';
import { Comparator } from './comparator';
import { TableModel } from './table_model';
import { Operation } from './operations';

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
      columnOrder?: SortedTableModel.Order[]) {
    super();
  }

  /** Returns the column sort order. */
  public get columnOrder(): SortedTableModel.Order[] {
    return null;
  }

  /** Sets the order that the columns are sorted by. */
  public set columnOrder(columnOrder: SortedTableModel.Order[]) {}

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

export namespace SortedTableModel {

  /** Specifies whether to sort in ascending order or descending order. */
  export enum Order {

    /** Items are sorted in increasing order. */
    ASCENDING,

    /** Items are sorted in decreasing order. */
    DESCENDING
  }
}
