import { TableModel } from './table_model';

/** Unifies all operations that can be performed on a TableModel. */
export type Operation = AddRowOperation | MoveRowOperation |
  RemoveRowOperation | UpdateValueOperation;

/** Adds a row. */
export class AddRowOperation {

  /** Constructs an operation to add a row.
   * @param index - The index of the row.
   * @param row - A single row table representing the row that was added.
   */
  constructor(index: number, row: TableModel) {
    this._index = index;
    this._row = row;
  }

  /** Returns the index of the new row. */
  public get index(): number {
    return this._index;
  }

  /** Returns a single row table representing the row that was added. */
  public get row(): TableModel {
    return this._row;
  }

  private _index: number;
  private _row: TableModel;
}

/** Moves a row. */
export class MoveRowOperation {

  /** Constructs a move operation.
   * @param source - The index of the row to move from.
   * @param destination - The index of the row to move to.
   */
  constructor(source: number, destination: number) {
    this._source = source;
    this._destination = destination;
  }

  /** Returns the index of the row being moved from. */
  public get source(): number {
    return this._source;
  }

  /** Returns the index of the row being moved to. */
  public get destination(): number {
    return this._destination;
  }

  private _source: number;
  private _destination: number;
}

/** Removes a row. */
export class RemoveRowOperation {

  /** Constructs an operation to remove a row.
   * @param index - The index of the row to remove.
   * @param row - A single row table representing the row that was removed.
   */
  constructor(index: number, row: TableModel) {
    this._index = index;
    this._row = row;
  }

  /** Returns the index of the row that was removed. */
  public get index(): number {
    return this._index;
  }

  /** Returns a single row table representing the row that was removed. */
  public get row(): TableModel {
    return this._row;
  }

  private _index: number;
  private _row: TableModel;
}

/** Updates a value. */
export class UpdateValueOperation {

  /** Constructs an operation to update a value.
   * @param row - The index of the row to update.
   * @param column - The index of the column to update.
   * @param previous - The value previously at the row and column.
   * @param current - The value currently at the row and column.
   */
  constructor(row: number, column: number, previous: any, current: any) {
    this._row = row;
    this._column = column;
    this._previous = previous;
    this._current = current;
  }

  /** Returns the index of the updated row. */
  public get row(): number {
    return this._row;
  }

  /** Returns the index of the updated column. */
  public get column(): number {
    return this._column;
  }

  /** Returns the value previously at the row and column. */
  public get previous(): any {
    return this._previous;
  }

  /** Returns the value currently at the row and column. */
  public get current(): any {
    return this._current;
  }

  private _row: number;
  private _column: number;
  private _previous: any;
  private _current: any;
}
