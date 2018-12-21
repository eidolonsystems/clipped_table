import { Expect, Test } from "alsatian";
import { AddRowOperation, ArrayTableModel, Operation, RemoveRowOperation, MoveRowOperation, UpdateValueOperation } from '../source';

/** Tests the ArrayTableModel. */
export class ArrayTableModelTester {

  /** Tests adding rows. */
  @Test()
  public testAddRow(): void {
    const model = new ArrayTableModel();
    let receivedIndex = undefined;
    const slot = (operations: Operation[]) => {
      if(operations) {
        const operation = operations[operations.length-1];
        if(operation instanceof AddRowOperation) {
          receivedIndex = operation.index;
        } else {
          receivedIndex = undefined;
          Expect(false).toEqual(true);
        } 
      } else {
        receivedIndex = undefined;
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
    const slot = (operations: Operation[]) => {
      if(operations) {
        const operation = operations[operations.length - 1];
        if(operation instanceof RemoveRowOperation ) {
          receivedIndex = operation.index;
        } else if (operation instanceof AddRowOperation){
          //???????????????
        } 
        else {
          receivedIndex = undefined;
          Expect(false).toEqual(true);
        }
      } else {
        receivedIndex = undefined;
        Expect(false).toEqual(true);
      }
    };
    const listener = model.connect(slot);
    Expect(model.rowCount).toEqual(0);
    Expect(model.columnCount).toEqual(0);

    Expect(() => model.removeRow(1)).toThrow();
    Expect(() => model.addRow([1, 2])).not.toThrow();
    Expect(model.rowCount).toEqual(1);
    console.log('added first row');

    Expect(() => model.addRow([3, 4])).not.toThrow();
    Expect(model.rowCount).toEqual(2);
    console.log('added second row');

    Expect(() => model.addRow([5, 6])).not.toThrow();
    Expect(model.rowCount).toEqual(3);
    console.log('added third row');

    Expect(() => model.removeRow(0)).not.toThrow();
    Expect(model.rowCount).toEqual(2)
    Expect(receivedIndex).toEqual(0); 
    Expect(() => model.removeRow(2)).toThrow();
    Expect(receivedIndex).toEqual(undefined); 
    console.log('Want to reach here!');
    listener.unlisten();
  }
  /** Tests setting rows. */
  @Test()
  public testSetRow(): void {
    const model = new ArrayTableModel();
//
    const slot = (operations: Operation[]) => {
      if(operations) {
        const operation = operations[operations.length - 1];
        if(operation instanceof UpdateValueOperation ) {
          //????????
        } else {
          
        }
      } else {
        Expect(false).toEqual(true);
      }
    };
    const listener = model.connect(slot);
    Expect(model.rowCount).toEqual(0);
    Expect(model.columnCount).toEqual(0);
    Expect(() => model.set(0,0,10)).toThrow();

    
    Expect(() => model.addRow([1, 2])).not.toThrow();
    Expect(model.rowCount).toEqual(1);

    Expect(() => model.addRow([3, 4])).not.toThrow();
    Expect(model.rowCount).toEqual(2);

    Expect(() => model.set(0,0, 8)).not.toThrow();
    Expect(() => model.set(1,0, 9)).not.toThrow();
    Expect(() => model.set(1,2, 9)).toThrow();
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
                 operation instanceof UpdateValueOperation){
          //Expect(false).toEqual(true);
        } else {
        }
      } else {
        //Expect(false).toEqual(true);
      }
    };
    const listener = model.connect(slot);
    Expect(model.rowCount).toEqual(0);
    Expect(model.columnCount).toEqual(0);
    Expect(() => model.moveRow(0,1)).toThrow();
    Expect(() => model.addRow([2, 4])).not.toThrow();
    Expect(model.rowCount).toEqual(1);
    Expect(() => model.addRow([8, 9])).not.toThrow();
    Expect(model.rowCount).toEqual(2);
    Expect(() => model.addRow([0, 7])).not.toThrow();
    Expect(model.rowCount).toEqual(3);
    Expect(model.get(0, 0)).toEqual(2); 
    Expect(model.get(0, 1)).toEqual(4);
    Expect(model.get(1, 0)).toEqual(8); 
    Expect(model.get(1, 1)).toEqual(9);
    Expect(model.get(2, 0)).toEqual(0);
    Expect(model.get(2, 1)).toEqual(7);
    Expect(() => model.moveRow(1,2)).not.toThrow();
    Expect(model.get(0, 0)).toEqual(2); 
    Expect(model.get(0, 1)).toEqual(4);
    Expect(model.get(1, 0)).toEqual(0); 
    Expect(model.get(1, 1)).toEqual(7);
    Expect(model.get(2, 0)).toEqual(8);
    Expect(model.get(2, 1)).toEqual(9);
    listener.unlisten();
  }
}
