import * as Kola from 'kola-signals';
import { Operation } from './operations';
import { TableModel } from './table_model';

export abstract class Predicate {

  /**
   * @param  row - The row to apply the predicate to.
   */
  public abstract applyPredicate(row: any[]): boolean;
}

export class FilteredTableModel extends TableModel {

  /** Constructs a FilteredTableModel.
   * @param source - The underlying model to filter.
   */
  public constructor(model: TableModel, predicate: Predicate) {
    super();
    this.model = model;
    this.predicate = predicate;
    this.length = 0;
    this.filter();
    this.transactionCount = 0;
    this.operations = [];
    this.dispatcher = new Kola.Dispatcher<Operation[]>();
    this.model.connect(this.handleOperations.bind(this));
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

  public get rowCount(): number {
    return this.length;
  }

  public get columnCount(): number {
    return this.model.columnCount;
  }

  public get(row: number, column: number) {
    if(row >= this.length || row < 0) {
      throw RangeError();
    }
    if(column >= this.columnCount || column < 0) {
      throw RangeError();
    }
  }
  public connect(slot: (operations: Operation[]) => void):
    Kola.Listener<Operation[]> {
    throw new Error("Method not implemented.");
  }

  private handleOperations(newOperations: Operation[]): void {
    this.beginTransaction();
    for(const operation of newOperations) {
    }
    this.endTransaction();
  }
  private filter() {
    this.visiblity = [];
    for(let i = 0; i < this.model.rowCount; ++i) {
      if(true) {
        this.visiblity.push(true);
        this.length++;
      } else {
        this.visiblity.push(false);
      }
    }
  }

  private model: TableModel;
  private visiblity: boolean[];
  private predicate: Predicate;
  private length: number;
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
