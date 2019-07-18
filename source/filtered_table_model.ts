import * as Kola from 'kola-signals';
import { AddRowOperation, Operation, RemoveRowOperation, UpdateValueOperation }
  from './operations';
import { TableModel } from './table_model';

export abstract class Predicate {

  public abstract get index(): number;

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
    console.log('subtable', this.subTable[row]);
    console.log('model', this.model);
    return this.model.get(this.subTable[row], column);
  }
  public connect(slot: (operations: Operation[]) => void):
    Kola.Listener<Operation[]> {
    throw new Error("Method not implemented.");
  }

  private handleOperations(newOperations: Operation[]): void {
    this.beginTransaction();
    for(const operation of newOperations) {
      if(operation instanceof AddRowOperation) {
            throw new Error("Method not implemented.");
      } else if(operation instanceof RemoveRowOperation) {
        throw new Error("Method not implemented.");
      } else if(operation instanceof UpdateValueOperation) {
        console.log('ROW UPDATED!');
        this.rowUpdated(operation);
      }
    }
    this.endTransaction();
  }
  private filter() {
    this.visiblity = [];
    this.subTable = [];
    for(let i = 0; i < this.model.rowCount; ++i) {
      if(this.predicate.applyPredicate(
          this.model.get(i, this.predicate.index))) {
        this.visiblity.push(this.length);
        this.subTable.push(i);
        this.length++;
      } else {
        this.visiblity.push(-1);
      }
    }
  }

  private rowUpdated(operation: UpdateValueOperation) {
    console.log('howdy!');
    const row = operation.row;
    const truthyness =
      this.predicate.applyPredicate(this.model.get(row, this.predicate.index));
    if(this.visiblity[row] > -1) {
      console.log('was truuuu');
      if(truthyness) {
        console.log('is true');
      } else {
        if(this.visiblity[row] >= 0) {
        const subTableIndex = this.subTable[this.visiblity[row]];
        for(let i = subTableIndex ; i < this.length; ++i ) {
          this.visiblity[this.subTable[i]]--;
        }
        this.subTable.splice(this.visiblity[row], 1);
        this.visiblity[row] = -1;
        this.length--;
        }
      }
    } else {
      console.log('was false');
      if(truthyness) {
        console.log('was false and is true');
                console.log('was false');
        let newIndex = this.length;
        for(let i = 0; i < this.length; ++i) {
          if(this.subTable[i] > row && newIndex === this.length) {
            newIndex = i;
          } else {
            this.visiblity[this.subTable[i]]++;
            this.subTable[i]++;
          }
        }
        this.visiblity[row] = newIndex;
        this.subTable.splice(newIndex, 0, row);
        this.length++;
      }
    }
  }

  private model: TableModel;
  private visiblity: number[];
  private subTable: number[];
  private predicate: Predicate;
  private length: number;
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
