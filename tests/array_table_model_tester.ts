import { Expect, Test } from 'alsatian';
import { AddRowOperation, ArrayTableModel, MoveRowOperation, Operation,
  RemoveRowOperation, UpdateValueOperation, TableModel } from '../source';

/** Tests the ArrayTableModel. */
export class ArrayTableModelTester {

  /** Tests adding rows. */
//  @Test()
  public testAddRow(): void {
    const model = new ArrayTableModel();
    let receivedIndex = undefined;
    let addedRow = new ArrayTableModel();
    const slot = (operations: Operation[]) => {
      if(operations) {
        const operation = operations[operations.length - 1];
        if(operation instanceof AddRowOperation) {
          receivedIndex = operation.index;
          if(operation.row instanceof ArrayTableModel) {
            addedRow = operation.row;
          }
        } else {
          Expect(false).toEqual(true);
        }
      } else {
        Expect(false).toEqual(true);
      }
    };
    const listener = model.connect(slot);
    Expect(model.rowCount).toEqual(0);
    Expect(model.columnCount).toEqual(0);
    Expect(() => model.addRow([1, 2], 0)).not.toThrow();
    Expect(model.rowCount).toEqual(1);
    Expect(model.get(0, 0)).toEqual(1);
    Expect(model.get(0, 1)).toEqual(2);
    Expect(receivedIndex).toEqual(0);
    if(addedRow instanceof ArrayTableModel) {
      Expect(addedRow.get(0, 0)).toEqual(1);
      Expect(addedRow.get(0, 1)).toEqual(2);
    }
    receivedIndex = undefined;
    Expect(() => model.addRow([1, 2, 3], 0)).toThrow();
    Expect(receivedIndex).toEqual(undefined);
    receivedIndex = undefined;
    Expect(() => model.addRow([5, 7], 1)).not.toThrow();
    Expect(model.rowCount).toEqual(2);
    Expect(model.get(0, 0)).toEqual(1);
    Expect(model.get(0, 1)).toEqual(2);
    Expect(model.get(1, 0)).toEqual(5);
    Expect(model.get(1, 1)).toEqual(7);
    Expect(receivedIndex).toEqual(1);
    listener.unlisten();
  }

  /** Tests removing rows. */
  @Test()
  public testRemoveRow(): void {
    const model = new ArrayTableModel();
    let receivedIndex = undefined;
    let removedRow = new ArrayTableModel();
    const slot = (operations: Operation[]) => {
      if(operations) {
        const operation = operations[operations.length - 1];
        if(operation instanceof RemoveRowOperation ) {
          receivedIndex = operation.index;
          if(operation.row instanceof ArrayTableModel) {
            removedRow = operation.row;
          }
        } else if (operation instanceof AddRowOperation) {
          return;
        } else {
          Expect(false).toEqual(true);
        }
      } else {
        Expect(false).toEqual(true);
      }
    };
    const listener = model.connect(slot);
    Expect(() => model.removeRow(0)).toThrow();
    Expect(receivedIndex).toEqual(undefined);
    receivedIndex = undefined;
    Expect(() => model.addRow([1, 2])).not.toThrow();
    Expect(() => model.addRow([3, 4])).not.toThrow();
    Expect(() => model.addRow([5, 6])).not.toThrow();
    Expect(model.rowCount).toEqual(3);
    Expect(() => model.removeRow(0)).not.toThrow();
    Expect(model.rowCount).toEqual(2);
    Expect(receivedIndex).toEqual(0);
    receivedIndex = undefined;
    if(removedRow instanceof ArrayTableModel) {
      Expect(removedRow.get(0, 0)).toEqual(1);
      Expect(removedRow.get(0, 1)).toEqual(2);
    }
    Expect(() => model.get(0, 0).toEqual(3));
    Expect(() => model.get(0, 1).toEqual(4));
    Expect(() => model.get(1, 0).toEqual(5));
    Expect(() => model.get(1, 1).toEqual(6));
    Expect(() => model.removeRow(2)).toThrow();
    Expect(receivedIndex).toEqual(undefined);
    listener.unlisten();
  }

  /** Tests setting rows. */
  @Test()
  public testSetRow(): void {
    const model = new ArrayTableModel();
    let oldValue = undefined;
    let newValue = undefined;
    let indexRow = undefined;
    let indexColumn = undefined;
    const slot = (operations: Operation[]) => {
      if(operations) {
        const operation = operations[operations.length - 1];
        if(operation instanceof UpdateValueOperation ) {
          oldValue = operation.previous;
          newValue = operation.current;
          indexRow = operation.row;
          indexColumn = operation.column;
        } else if (operation instanceof AddRowOperation) {
          return;
        } else {
          Expect(false).toEqual(true);
        }
      } else {
        Expect(false).toEqual(true);
      }
    };
    const listener = model.connect(slot);
    Expect(() => model.set(0, 0, 10)).toThrow();
    Expect(oldValue).toEqual(undefined);
    Expect(newValue).toEqual(undefined);
    Expect(indexRow).toEqual(undefined);
    Expect(indexColumn).toEqual(undefined);
    model.addRow([1, 2]);
    model.addRow([3, 4]);
    Expect(() => model.set(1, 0, 9)).not.toThrow();
    Expect(oldValue).toEqual(3);
    Expect(newValue).toEqual(9);
    Expect(indexRow).toEqual(1);
    Expect(indexColumn).toEqual(0);
    Expect(() => model.get(0, 0).toEqual(8));
    Expect(() => model.get(1, 0).toEqual(9));
    Expect(() => model.set(0, 8, 9)).toThrow();
    Expect(() => model.set(8, 0, 9)).toThrow();
    listener.unlisten();
  }

  /** Tests movings rows. */
  @Test()
  public testMoveRow(): void {
    const model = new ArrayTableModel();
    let sourceIndex = undefined;
    let destinationIndex = undefined;
    const slot = (operations: Operation[]) => {
      if(operations) {
        const operation = operations[operations.length - 1];
        if(operation instanceof MoveRowOperation ) {
          sourceIndex = operation.source;
          destinationIndex = operation.destination;
        } else if(operation instanceof AddRowOperation ||
            operation instanceof RemoveRowOperation ||
            operation instanceof UpdateValueOperation) {
          return;
        } else {
          Expect(false).toEqual(true);
        }
      } else {
        Expect(false).toEqual(true);
      }
    };
    const listener = model.connect(slot);
    Expect(model.rowCount).toEqual(0);
    Expect(model.columnCount).toEqual(0);
    Expect(() => model.moveRow(0,1)).toThrow();
    Expect(sourceIndex).toEqual(undefined);
    Expect(destinationIndex).toEqual(undefined);
    model.addRow([2, 4]);
    model.addRow([8, 9]);
    model.addRow([0, 7]);
    Expect(() => model.moveRow(5,9)).toThrow();
    Expect(sourceIndex).toEqual(undefined);
    Expect(destinationIndex).toEqual(undefined);
    Expect(model.rowCount).toEqual(3);
    Expect(model.get(0, 0)).toEqual(2);
    Expect(model.get(0, 1)).toEqual(4);
    Expect(model.get(1, 0)).toEqual(8);
    Expect(model.get(1, 1)).toEqual(9);
    Expect(model.get(2, 0)).toEqual(0);
    Expect(model.get(2, 1)).toEqual(7);
    Expect(() => model.moveRow(1,2)).not.toThrow();
    Expect(model.rowCount).toEqual(3);
    Expect(model.get(0, 0)).toEqual(2);
    Expect(model.get(0, 1)).toEqual(4);
    Expect(model.get(1, 0)).toEqual(0);
    Expect(model.get(1, 1)).toEqual(7);
    Expect(model.get(2, 0)).toEqual(8);
    Expect(model.get(2, 1)).toEqual(9);
    Expect(sourceIndex).toEqual(1);
    Expect(destinationIndex).toEqual(2);
    listener.unlisten();
  }

  /** Tests recursive transactions. */
  @Test()
  public testRecursive(): void {
    const model = new ArrayTableModel();
    const slot = (operations: Operation[]) => {
      Expect(operations.length).toEqual(5);
      if(operations) {
        if(operations[0] instanceof AddRowOperation &&
          operations[1] instanceof UpdateValueOperation &&
          operations[2] instanceof AddRowOperation &&
          operations[3] instanceof RemoveRowOperation &&
          operations[4] instanceof AddRowOperation) {
            Expect(true).toEqual(true);
        }
      } else {
        Expect(false).toEqual(true);
      }
    };
    const listener = model.connect(slot);
    model.beginTransaction();
    model.addRow([1, 2, 3]);
    model.beginTransaction();
    model.set(0, 0, 10);
    model.beginTransaction();
    model.addRow([9, 0, 2]);
    model.endTransaction();
    model.removeRow(1);
    model.endTransaction();
    model.addRow([8, 9, 9]);
    model.endTransaction();
    listener.unlisten();
  }
}
