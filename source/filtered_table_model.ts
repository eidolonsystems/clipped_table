import * as Kola from 'kola-signals';
import { ArrayTableModel } from './array_table_model';
import { AddRowOperation, Operation, RemoveRowOperation, UpdateValueOperation }
  from './operations';
import { TableModel } from './table_model';

export class FilteredTableModel extends TableModel {

  /** Constructs a FilteredTableModel.
   * @param source - The underlying model to filter.
   * @param predicate - The predicate used to filter the table.
   */
  public constructor(model: TableModel,
      predicate: (model: TableModel, row: number) =>  boolean) {
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
    return this.model.get(this.subTable[row], column);
  }

  public connect(slot: (operations: Operation[]) => void):
      Kola.Listener<Operation[]> {
    return this.dispatcher.listen(slot);
  }

  private beginTransaction() {
    if(this.transactionCount === 0) {
      this.operations = [];
    }
    ++this.transactionCount;
  }

  private endTransaction() {
    --this.transactionCount;
    if(this.transactionCount === 0) {
      this.dispatcher.dispatch(this.operations);
    }
  }

  private filter() {
    this.visiblity = [];
    this.subTable = [];
    for(let i = 0; i < this.model.rowCount; ++i) {
      if(this.predicate(this.model, i)) {
        this.visiblity.push(this.length);
        this.subTable.push(i);
        ++this.length;
      } else {
        this.visiblity.push(-1);
      }
    }
  }

  private handleOperations(newOperations: Operation[]): void {
    this.beginTransaction();
    for(const operation of newOperations) {
      if(operation instanceof AddRowOperation) {
        this.rowAdded(operation);
      } else if(operation instanceof RemoveRowOperation) {
        this.rowDeleted(operation);
      } else if(operation instanceof UpdateValueOperation) {
        this.rowUpdated(operation);
      }
    }
    this.endTransaction();
  }

  private makeRow(rowIndex: number) {
    const array = [] as any[];
    for(let i = 0; i < this.model.columnCount; ++i) {
      array.push(this.model.get(rowIndex, i));
    }
    const row = new ArrayTableModel();
    row.addRow(array);
    return row;
  }

  private rowAdded(operation: AddRowOperation) {
    const rowAddedIndex = operation.index;
    if(this.predicate(operation.row, 0)) {
      let newIndex = this.length;
      for(let i = 0; i < this.length; ++i) {
        if(this.subTable[i] >= rowAddedIndex && newIndex === this.length) {
          newIndex = i;
        }
        if(newIndex !== this.length) {
          ++this.visiblity[this.subTable[i]];
          ++this.subTable[i];
        }
      }
      this.subTable.splice(newIndex, 0, rowAddedIndex);
      this.visiblity.splice(rowAddedIndex, 0, newIndex);
      ++this.length;
      this.operations.push(new AddRowOperation(newIndex, operation.row));
    } else {
      for(let i = 0; i < this.length; ++i) {
        if(this.subTable[i] >= rowAddedIndex) {
          ++this.subTable[i];
        }
      }
      this.visiblity.splice(rowAddedIndex, 0, -1);
    }
  }

  private rowDeleted(operation: RemoveRowOperation) {
    const rowIndex = operation.index;
    const subTableIndex = this.visiblity[rowIndex];
    if(subTableIndex > -1) {
      for(let i = subTableIndex; i < this.length; ++i) {
        if(this.subTable[i] > rowIndex) {
          --this.visiblity[this.subTable[i]];
          --this.subTable[i];
        }
      }
      this.subTable.splice(subTableIndex, 1);
      --this.length;
      this.operations.push(
        new RemoveRowOperation(subTableIndex, operation.row));
    } else {
      for(let i = 0; i < this.length; ++i) {
        if(this.subTable[i] > rowIndex) {
          --this.subTable[i];
        }
      }
    }
    this.visiblity.splice(rowIndex, 1);
  }

  private rowUpdated(operation: UpdateValueOperation) {
    const rowIndex = operation.row;
    if(this.visiblity[rowIndex] > -1) {
      if(this.predicate(this.model, rowIndex)) {
        const newIndex = this.visiblity[rowIndex];
        this.operations.push(new UpdateValueOperation(
          newIndex, operation.column, operation.previous, operation.current));
      } else {
        const subTableIndex = this.visiblity[rowIndex];
        for(let i = subTableIndex; i < this.length; ++i) {
          --this.visiblity[this.subTable[i]];
        }
        this.subTable.splice(subTableIndex, 1);
        this.visiblity[rowIndex] = -1;
        --this.length;
        this.operations.push(
          new RemoveRowOperation(subTableIndex, this.makeRow(rowIndex)));
      }
    } else {
      if(this.predicate(this.model, rowIndex)) {
        let newIndex = this.length;
        for(let i = 0; i < this.length; ++i) {
          if(this.subTable[i] > rowIndex && newIndex === this.length) {
            newIndex = i;
          }
          if(newIndex !== this.length) {
            ++this.visiblity[this.subTable[i]];
          }
        }
        this.visiblity[rowIndex] = newIndex;
        this.subTable.splice(newIndex, 0, rowIndex);
        ++this.length;
        this.operations.push(
          new AddRowOperation(newIndex, this.makeRow(rowIndex)));
      }
    }
  }

  private model: TableModel;
  private visiblity: number[];
  private subTable: number[];
  private predicate: (model: TableModel, row: number) =>  boolean;
  private length: number;
  private transactionCount: number;
  private operations: Operation[];
  private dispatcher: Kola.Dispatcher<Operation[]>;
}
