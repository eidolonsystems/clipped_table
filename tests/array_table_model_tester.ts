import { Expect, Test } from "alsatian";
import { AddRowOperation, ArrayTableModel, Operation } from '../source';

/** Tests the ArrayTableModel. */
export class ArrayTableModelTester {

  /** Tests adding rows. */
  @Test()
  public testAddRow(): void {
    const model = new ArrayTableModel();
    let receivedIndex = undefined;
    const slot = (operations: Operation[]) => {
      console.log('A SIGNAL WAS SENT!');
      if(operations) {
        const operation = operations[operations.length-1];
        if(operation instanceof AddRowOperation) {
          console.log('Operation index: ' + operation.index);
          receivedIndex = operation.index;
        } else {
          console.log('NOT A ADD ROW OP');
          receivedIndex = undefined;
          Expect(false).toEqual(true);
        }
      } else {
        console.log('NOT A ADD ROW OP');
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
    Expect(() => model.addRow([1, 2, 3], 0)).toThrow();
    Expect(receivedIndex).toEqual(undefined);
    console.log('Want to reach here!');
    Expect(() => model.addRow([5, 7], 1)).not.toThrow();
    Expect(model.rowCount).toEqual(2);
    Expect(model.get(0, 0)).toEqual(1); 
    Expect(model.get(0, 1)).toEqual(2);
    Expect(model.get(1, 0)).toEqual(5);
    Expect(model.get(1, 1)).toEqual(7);
    Expect(receivedIndex).toEqual(1); //???
    listener.unlisten();
  }
}
