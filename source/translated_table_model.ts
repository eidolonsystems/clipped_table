import * as Kola from 'kola-signals';
import { AddRowOperation, MoveRowOperation, Operation,
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
    this.handleOperations.bind(this);
    model.connect((operations: Operation[]) =>
      this.handleOperations(operations));
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
    if(source >= this.rowCount || source < 0) {
      throw RangeError('Source is out of bounds.');
    }
    if(destination >= this.rowCount || destination < 0) {
      throw RangeError('Destination out of bounds.');
    }
    this.beginTransaction();
    const traveller = (() => {
      if(this.references[source] >= 0) {
        return this.references[source];
      } else {
        return source;
      }
    })();
    if(source > destination) {
      this.slideDown(source, destination);
    } else if(destination > source) {
      this.slideUp(source, destination);
    }
    this.references[destination] = traveller;
    this.operations.push(new MoveRowOperation(source, destination));
    this.endTransaction();
  }

  public get rowCount(): number {
    return this.model.rowCount;
  }

  public get columnCount(): number {
    return this.model.columnCount;
  }

  public get(row: number, column: number): any {
    if(row >= this.rowCount || row < 0) {
      throw RangeError();
    }
    if(column >= this.columnCount || column < 0) {
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
        this.rowAdded(operation);
      } else if(operation instanceof RemoveRowOperation) {
        this.rowRemoved(operation);
      } else if(operation instanceof UpdateValueOperation) {
        this.updateRow(operation);
      } else {
        throw TypeError();
      }
    }
    this.endTransaction();
  }

  private slideUp(start: number, end: number) {
    for(let index = start; index < end; ++index) {
      if(this.references[index + 1] >= 0) {
        this.references[index] = this.references[index + 1];
      } else {
        this.references[index] = index + 1;
      }
    }
  }

  private slideDown(start: number, end: number) {
    for(let index = start; index > end; --index) {
      if(this.references[index - 1] >= 0) {
        this.references[index] = this.references[index - 1];
      } else {
        this.references[index] = index - 1;
      }
    }
  }

  private rowAdded(operation: AddRowOperation) {
    this.beginTransaction();
    this.references.push(undefined);
    let referenceIndex = operation.index;
    for(let index = 0; index < this.references.length; ++index) {
      if(this.references[index] === operation.index) {
        referenceIndex = index;
      }
    }
    this.slideDown(this.references.length - 1, referenceIndex);
    for(let index = 0; index < this.references.length; ++index) {
      if(this.references[index] >= operation.index
          && index !== referenceIndex) {
        this.references[index] = this.references[index] + 1;
      }
    }
    this.operations.push(new AddRowOperation(referenceIndex, operation.row));
    this.endTransaction();
  }

  private rowRemoved(operation: RemoveRowOperation) {
    this.beginTransaction();
    let referenceIndex = operation.index;
    for(let index = 0; index < this.references.length; ++index) {
      if(this.references[index] === operation.index) {
        referenceIndex = index;
      }
    }
    this.slideUp(referenceIndex, this.references.length);
    this.references.pop();
    for(let index = 0; index < this.references.length; ++index) {
      if(this.references[index] > operation.index) {
        this.references[index] = this.references[index] - 1;
      }
    }
    this.operations.push(
      new RemoveRowOperation(referenceIndex, operation.row));
    this.endTransaction();
  }

  private updateRow(operation: UpdateValueOperation) {
    this.beginTransaction();
    let referenceIndex = operation.row;
    for(let index = 0; index < this.references.length; ++index) {
      if(this.references[index] === operation.row) {
        referenceIndex = index;
      }
    }
    this.operations.push(
      new UpdateValueOperation(referenceIndex, operation.column,
        operation.previous, operation.current));
    this.endTransaction();
  }

  private model: TableModel;
  private references: any[];
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
