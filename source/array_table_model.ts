import * as Kola from 'kola-signals';
import { AddRowOperation, Operation } from './operations';
import { TableModel } from './table_model';

/** Implements a TableModel using an 2-dimensional array. */
export class ArrayTableModel extends TableModel {

  /** Constructs an empty model. */
  constructor() {
    super();
    this.values = [];
    this.transactionCount = 0;
     this.operations = [];
    this.dispatcher = new Kola.Dispatcher<Operation[]>();
  }

  /** Marks the beginning of a transaction. In cases where a transaction is
   *  already being processed, then the sub-transaction gets consolidated into
   *  the parent transaction.
   */
  public beginTransaction(): void {
  }

  /** Ends a transaction. */
  public endTransaction(): void {
    this.dispatcher.dispatch(this.operations);
  }

  /** Adds a row to the table.
   * @param row - The row to add.
   * @param index - The index to add the row to.
   * @throws RangeError - The length of the row being added is not exactly equal
   *                      to this table's columnCount.
   * @throws RangeError - The index specified is not within range.
   */
  public addRow(row: any[], index?: number): void {
    if(this.rowCount != 0 && row.length != this.columnCount) {
      throw RangeError();
    }
    if(index === undefined) {
      index = this.values.length;
    }
    if(index > this.rowCount || index < 0) {
      throw RangeError();
    }
    this.beginTransaction();
    this.values.splice(index, 0, row.slice());
    const table = new ArrayTableModel();
    table.values = row.slice();
    this.operations.push(new AddRowOperation(index, table));
    console.log('ADDED!');
    this.endTransaction();
  }

  /** Moves a row.
   * @param source - The index of the row to move.
   * @param destination - The index to move the row to.
   * @throws RangeError - The source or destination are not within this table's
   *                      range.
   */
  public moveRow(source: number, destination: number): void {}

  /** Removes a row from the table.
   * @param index - The index of the row to remove.
   * @throws RangeError - The index is not within this table's range.
   */
  public removeRow(index: number): void {}

  /** Sets a value at a specified row and column.
   * @param row - The row to set.
   * @param column - The column to set.
   * @param value - The value to set at the specified row and column.
   * @throws RangeError - The row or column is not within this table's range.
   */
  public set(row: number, column: number, value: any): void {}

  public get rowCount(): number {
    if(this.values.length === 1 && this.values[0].length === 0){
      return 0;
    } else {
      return this.values.length;
    }
  }

  public get columnCount(): number {
    if(this.rowCount === 0){
      return 0;
    } else {
      return this.values[0].length;
    }
  }

  public get(row: number, column: number): any {
    return this.values[row][column];
  }

  public connect(slot: (operations: Operation[]) => void):
      Kola.Listener<Operation[]> {
    return this.dispatcher.listen(slot);
  }

  private values: any[][];
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
