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
    this.reverseTranslation = [];
    for(let i = 0; i < model.rowCount; ++i) {
      this.translation.push(i);
      this.reverseTranslation.push(i);
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
     // console.log('table', this.translation.toString());
     // console.log('reverse table', this.reverseTranslation.toString());
     // console.log('operation is done.');
      let used = [] as any[];
      for(let index = 0; index < this.rowCount; ++index) {
        if(used.includes(this.reverseTranslation[index])) {
        //  console.log('translation', this.translation.toString());
        //  console.log('reverse translation',this.reverseTranslation.toString());
          //throw Error('INDEXED TWICE!!!! ' + index);
        } else {
          used.push(this.reverseTranslation[index]);
        }
      }
      used = [] as any[];
      for(let index = 0; index < this.rowCount; ++index) {
        if(used.includes(this.translation[index])) {
        //  console.log('translation', this.translation.toString());
        //  console.log('reverse translation',this.reverseTranslation.toString());
          //throw Error('INDEXED TWICE!!!! Reversed Table! ' + index);
        } else {
          used.push(this.translation[index]);
        }
      }
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
      //  console.log('tt: removed row op started');
      //  console.log('removing', operation.index);
        this.rowRemoved(operation);
      //  console.log('tt: removed row op ended');
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
    const direction = (() => {
      if(source > dest) {
        return -1;
      } else {
        return 1;
      }
    })();
    this.reverseTranslation[movingRow] =
      this.reverseTranslation[movingRow] + (dest - source);
    for(let index = source; index !== dest; index = index + direction) {
      this.translation[index] = this.translation[index + direction];
      this.reverseTranslation[this.translation[index]] -= direction;
    }
    this.translation[dest] = movingRow;
  }

  private rowAdded(operation: AddRowOperation) {
    this.beginTransaction();
    if(operation.index >= this.translation.length) {
      this.reverseTranslation.push(operation.index);
      this.translation.push(operation.index);
      this.operations.push(new AddRowOperation(operation.index, operation.row));
      this.endTransaction();
      return;
    }
    const reverseIndex = this.reverseTranslation[operation.index];
    this.shift(1, operation.index, reverseIndex);
    this.translation.splice(reverseIndex, 0, operation.index);
    this.reverseTranslation.splice(operation.index, 0, reverseIndex);
    this.operations.push(new AddRowOperation(reverseIndex, operation.row));
    this.endTransaction();
  }

  private rowRemoved(operation: RemoveRowOperation) {
    this.beginTransaction();
    const reverseIndex = this.reverseTranslation[operation.index];
    this.shift(-1, operation.index, reverseIndex);
    this.translation.splice(reverseIndex, 1);
    this.reverseTranslation.splice(operation.index, 1);
    this.operations.push(new RemoveRowOperation(reverseIndex, operation.row));
    //console.log('translation ', this.translation.toString());
    //console.log('reversed translation ', this.reverseTranslation.toString());
//    console.log('after splice shift!');
    this.endTransaction();
  }

  private shift(amount: number, rowIndex: number, reverseIndex: number) {
    //console.log('translation ', this.translation.toString());
    //console.log('reversed translation ', this.reverseTranslation.toString());
    //console.log('start shift!');
    const start = (() => {
      if(reverseIndex < rowIndex) {
        return reverseIndex;
      } else {
        return rowIndex;
      }
    })();
//    console.log('start', start, 'amount', amount );
    const trans = this.translation.slice();
    const reverse = this.reverseTranslation.slice();
    for(let index = start; index < this.translation.length; ++index) {
      if(index >= rowIndex) {
        this.translation[reverse[index]] += amount;
      }
      this.reverseTranslation[trans[index]] += amount;
    }
    //console.log('translation ', this.translation.toString());
    //console.log('reversed translation ', this.reverseTranslation.toString());
    //console.log('end shift!');
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
