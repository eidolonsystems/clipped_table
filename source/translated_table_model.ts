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
    this.translation = [];
    for(let i = 0; i < model.rowCount; ++i) {
      this.translation[i] = i;
    }
    this.reverseTranslation = [];
    for(let i = 0; i < model.rowCount; ++i) {
      this.reverseTranslation[i] = i;
    }
    this.transactionCount = 0;
    this.dispatcher = new Kola.Dispatcher<Operation[]>();
    model.connect(this.handleOperations.bind(this));
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
    if(destination === source) {
      return;
    }
    this.beginTransaction();
    this.move(source, destination);
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
    return this.model.get(this.translation[row], column);
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

  private move(source: number, dest: number) {
    const movingRow = this.translation[source];
    if(source > dest) {
      this.reverseTranslation[movingRow] =
        this.reverseTranslation[movingRow] - Math.abs(source - dest);
      for(let index = source; index > dest; --index) {
        this.translation[index] = this.translation[index - 1];
        this.reverseTranslation[this.translation[index]] =
          this.reverseTranslation[this.translation[index]] + 1;
      }
    } else {
      this.reverseTranslation[movingRow] =
        this.reverseTranslation[movingRow] + Math.abs(dest - source);
      for(let index = source; index < dest; ++index) {
        this.translation[index] = this.translation[index + 1];
        this.reverseTranslation[this.translation[index]] =
          this.reverseTranslation[this.translation[index]] - 1;
      }
    }
    this.translation[dest] = movingRow;
  }

  private rowAdded(operation: AddRowOperation) {
    console.log('start: ', this.translation);
    console.log('start: ', this.reverseTranslation);
    this.beginTransaction();
    if(operation.index >= this.translation.length) {
      this.reverseTranslation.push(operation.index);
      this.translation.push(operation.index);
      this.operations.push(new AddRowOperation(operation.index, operation.row));
      this.endTransaction();
      return;
    }
    const operationIndex = this.reverseTranslation[operation.index];
    this.translation.push(0);
    this.reverseTranslation.push(0);
    for(let index = this.translation.length - 1; index >= 0; --index) {
      if(index > operationIndex) {
        this.translation[index] = this.translation[index - 1];
      }
      if(index > operation.index) {
        this.reverseTranslation[index] = this.reverseTranslation[index - 1];
      }
      if(this.translation[index] >= operation.index) {
        this.translation[index] = this.translation[index] + 1;
      }
      if(this.reverseTranslation[index] >= operation.index) {
        this.reverseTranslation[index] =
          this.reverseTranslation[index] + 1;
      }
    }
    this.translation[operationIndex] = operation.index;
    this.reverseTranslation[operationIndex] = operationIndex;
    this.operations.push(new AddRowOperation(operationIndex, operation.row));
    console.log('end: ', this.translation);
    console.log('end: ', this.reverseTranslation);
    this.endTransaction();
  }

  private rowRemoved(operation: RemoveRowOperation) {
    this.beginTransaction();
    const operationIndex = this.reverseTranslation[operation.index];
    const end = this.translation.length - 1;
    for(let index = 0; index < end; ++index) {
      if(index >= operationIndex) {
        this.translation[index] = this.translation[index + 1];
      }
      if(index >= operation.index) {
        this.reverseTranslation[index] = this.reverseTranslation[index + 1];
      }
      if(this.translation[index] > operation.index) {
        this.translation[index] = this.translation[index] - 1;
      }
      if(this.reverseTranslation[index] > operation.index) {
        this.reverseTranslation[index] = this.reverseTranslation[index] - 1;
      }
    }
    this.translation.pop();
    this.reverseTranslation.pop();
    this.operations.push(new RemoveRowOperation(operationIndex, operation.row));
    this.endTransaction();
  }

  private updateRow(operation: UpdateValueOperation) {
    this.beginTransaction();
    const referenceIndex = this.reverseTranslation[operation.row];
    this.operations.push(new UpdateValueOperation(referenceIndex,
      operation.column, operation.previous, operation.current));
    this.endTransaction();
  }

  private model: TableModel;
  private translation: number[];
  private reverseTranslation: number[];
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
