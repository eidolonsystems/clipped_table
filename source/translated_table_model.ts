import * as Kola from 'kola-signals';
import { Operation, AddRowOperation, MoveRowOperation, 
  RemoveRowOperation, UpdateValueOperation } from './operations';
import { TableModel } from './table_model';

/** Adapts an existing TableModel with the ability to rearrange rows. */
export class TranslatedTableModel extends TableModel {

  /** Constructs a model adapting an existing TableModel.
   * @param model The TableModel to adapt.
   */
  constructor(model: TableModel) {
    super();
    this.model = model;
    this.references = new Array(model.rowCount);
    this.transactionCount = 0;
    this.dispatcher = new Kola.Dispatcher<Operation[]>();
    model.connect(
      (operations: Operation[]) => {
      this.handleOperations(operations);});
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

  /** Moves a row.
   * @param source - The index of the row to move.
   * @param destination - The new index of the row.
   * @throws RangeError - The length of the row being added is not exactly equal
   *                      to this table's columnCount.
   * @throws RangeError - The index specified is not within range.
   */
  public moveRow(source: number, destination: number): void {
    if(source > this.rowCount || source < 0) {
      throw RangeError();
    }
    if(destination > this.rowCount || destination < 0) {
      throw RangeError();
    }
    this.beginTransaction();
    let traveller;
    if(this.references[source] >= 0) {
      traveller = this.references[source];
    } else {
      traveller = source;
    }
    if(source > destination) {
      this.moveDown(source, destination);
    } else if(destination > source) {
      this.moveUp(source, destination);
    }
    this.references[destination] = traveller;
    this.operations.push(new MoveRowOperation(source, destination));
    this.endTransaction();
  }

  public get rowCount(): number {
    return this.model.rowCount.valueOf();
  }

  public get columnCount(): number {
    return this.model.columnCount.valueOf();
  }

  public get(row: number, column: number): any {
    if(row >= this.rowCount || row  < 0) {
      throw RangeError();
    }
    if(column >= this.columnCount  || column < 0) {
      throw RangeError();
    }
    if(this.references[row] >= 0) {
        return this.model.get(this.references[row], column);
    } else {
      return this.model.get(row, column);
    }
  }

  public connect(slot: (operations: Operation[]) => void):
      Kola.Listener<Operation[]> {
    return this.dispatcher.listen(slot);
  }

  private handleOperations(newOperations: Operation[]): void {
    this.beginTransaction();
    for(const operation of newOperations) {
      if(operation instanceof AddRowOperation) {
        this.rowAdded(operation.index);
      } else if (operation instanceof MoveRowOperation) {
        // ??????
      } else if (operation instanceof RemoveRowOperation) {
        this.rowRemoved(operation.index);
      } else if (operation instanceof UpdateValueOperation) {
        // do nothing
      } else {
        throw TypeError;
      }
    }
    this.endTransaction();
  }

  private moveUp(start: number, end: number) {
    for(let index = start; index < end; index++ ) {
      if(this.references[index + 1] >= 0) {
        this.references[index] = this.references[index + 1];
      } else {
        this.references[index] = index + 1;
      }
    }
  }

  private moveDown(start: number, end: number) {
    if(start === end) {
      return;
    }
    if(end > start) {
      throw RangeError();
    }
    for(let index = start; index > end ; --index ) {
      if(this.references[index - 1] >= 0) {
        this.references[index] = this.references[index - 1];
      } else {
        this.references[index] = index - 1;
      }
    }
  }

  private rowAdded(addedRow: number) {
    this.references.push(undefined);
    let referenceIndex = addedRow;
    for(let index = 0; index < this.references.length; index++ ) {
      if(this.references[index] === addedRow) {
        referenceIndex = index;
      }
    }
    this.moveDown(this.references.length - 1, referenceIndex);
    for(let index = 0; index < this.references.length; index++ ) {
      if(this.references[index] >= addedRow && index !== referenceIndex) {
        this.references[index] = this.references[index] + 1;
      }
    }
  }

  private rowRemoved(deletedRow: number) {
    let referenceIndex = -1;
    for(let index = 0; index < this.references.length; index++ ) {
      if(this.references[index] === deletedRow) {
        referenceIndex = index;
      }
    }
    this.moveUp(referenceIndex, this.references.length);
    this.references.pop();
    for(let index = 0; index < this.references.length; index++ ) {
      if(this.references[index] > deletedRow) {
        this.references[index] = this.references[index] - 1;
      }
    }
  }

  private model: TableModel;
  private references: any[];
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
