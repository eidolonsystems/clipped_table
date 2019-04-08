import { Expect, Test } from 'alsatian';
import { ArrayTableModel, AddRowOperation, Operation, RemoveRowOperation,
  TranslatedTableModel, UpdateValueOperation } from '../source';

/** Tests the TranslatedTableModel. */
export class TranslatedTableModelTester {

  /** Tests if the number of rows is correct */
  @Test()
  public testRowCount(): void {
    const translatedTable = new TranslatedTableModel(new ArrayTableModel());
    Expect(translatedTable.rowCount).toEqual(0);
    const model = new ArrayTableModel();
    model.addRow([1, 2 ,3]);
    model.addRow([4, 5, 6]);
    model.addRow([7, 8, 9]);
    const translatedTable2 = new TranslatedTableModel(model);
    Expect(translatedTable2.rowCount).toEqual(3);
  }

  /** Tests if the number of columns is corrrect. */
  @Test()
  public testColumnCount(): void {
    const translatedTable = new TranslatedTableModel(new ArrayTableModel());
    Expect(translatedTable.columnCount).toEqual(0);
    const model = new ArrayTableModel();
    model.addRow([1, 2, 3, 0]);
    model.addRow([4, 5, 6, 0]);
    model.addRow([7, 8, 9, 0]);
    const translatedTable2 = new TranslatedTableModel(model);
    Expect(translatedTable2.columnCount).toEqual(4);
  }

  /** Tests if the get function works. */
  @Test()
  public testGet(): void {
    const model = new ArrayTableModel();
    model.addRow([1, 2, 3, 4, 5]);
    model.addRow([6, 7, 8, 9, 10]);
    const translatedTable = new TranslatedTableModel(model);
    Expect(translatedTable.get(0,1)).toEqual(2);
    Expect(translatedTable.get(1,3)).toEqual(9);
  }

  /** Tests the move fucntion. */
  @Test()
  public testMoveRow(): void {
    const model = new ArrayTableModel();
    model.addRow([1, 2, 1, 2]);
    model.addRow([3, 4, 3, 4]);
    model.addRow([5, 6, 5, 6]);
    model.addRow([7, 8, 7, 8]);
    model.addRow([9, 0, 9, 0]);
    const translatedTable = new TranslatedTableModel(model);
    Expect(() => translatedTable.moveRow(-1, 3)).toThrow();
    Expect(() => translatedTable.moveRow(10, 3)).toThrow();
    translatedTable.moveRow(0, 2);
    Expect(translatedTable.get(0,0)).toEqual(3);
    Expect(translatedTable.get(1,0)).toEqual(5);
    Expect(translatedTable.get(2,0)).toEqual(1);
    Expect(translatedTable.get(3,0)).toEqual(7);
    Expect(translatedTable.get(4,0)).toEqual(9);
    translatedTable.moveRow(3, 1);
    Expect(translatedTable.get(0,0)).toEqual(3);
    Expect(translatedTable.get(1,0)).toEqual(7);
    Expect(translatedTable.get(2,0)).toEqual(5);
    Expect(translatedTable.get(3,0)).toEqual(1);
    Expect(translatedTable.get(4,0)).toEqual(9);
    translatedTable.moveRow(3, 3);
    Expect(translatedTable.get(0,0)).toEqual(3);
    Expect(translatedTable.get(1,0)).toEqual(7);
    Expect(translatedTable.get(2,0)).toEqual(5);
    Expect(translatedTable.get(3,0)).toEqual(1);
    Expect(translatedTable.get(4,0)).toEqual(9);
    translatedTable.moveRow(0, 4);
    Expect(translatedTable.get(0,0)).toEqual(7);
    Expect(translatedTable.get(1,0)).toEqual(5);
    Expect(translatedTable.get(2,0)).toEqual(1);
    Expect(translatedTable.get(3,0)).toEqual(9);
    Expect(translatedTable.get(4,0)).toEqual(3);
    translatedTable.moveRow(4, 0);
    Expect(translatedTable.get(0,0)).toEqual(3);
    Expect(translatedTable.get(1,0)).toEqual(7);
    Expect(translatedTable.get(2,0)).toEqual(5);
    Expect(translatedTable.get(3,0)).toEqual(1);
    Expect(translatedTable.get(4,0)).toEqual(9);
  }

  /** Tests if signaling for the move operation works. */
  @Test()
  public testTwoMoves(): void {
    const model = new ArrayTableModel();
    model.addRow([1, 2]);
    model.addRow([3, 4]);
    model.addRow([5, 6]);
    model.addRow([7, 8]);
    model.addRow([9, 0]);
    const translatedTable = new TranslatedTableModel(model);
    let numberOfOperations = 0;
    const slot = (operations: Operation[]) => {
      if(operations) {
        numberOfOperations = operations.length;
      } else {
        Expect(false).toEqual(true);
      }
    };
    const listener = translatedTable.connect(slot);
    translatedTable.moveRow(0, 2);
    translatedTable.moveRow(1, 3);
    Expect(numberOfOperations).toEqual(1);
    listener.unlisten();
  }

  /** Tests when a row is added to the original model. */
  @Test()
  public testSignalListeningAdd(): void {
    const model = new ArrayTableModel();
    const translatedTable = new TranslatedTableModel(model);
    model.addRow([0,0]);
    model.addRow([1,1]);
    Expect(translatedTable.get(0, 0)).toEqual(0);
    Expect(translatedTable.get(1, 0)).toEqual(1);
    const model2 = new ArrayTableModel();
    model2.addRow([1, 2]);
    model2.addRow([3, 4]);
    model2.addRow([5, 6]);
    model2.addRow([7, 8]);
    const translatedTable2 = new TranslatedTableModel(model2);
    translatedTable2.moveRow(2, 0);
    model2.addRow([0, 0], 1);
    Expect(translatedTable2.get(0, 0)).toEqual(5);
    Expect(translatedTable2.get(1, 0)).toEqual(1);
    Expect(translatedTable2.get(2, 0)).toEqual(0);
    Expect(translatedTable2.get(3, 0)).toEqual(3);
    Expect(translatedTable2.get(4, 0)).toEqual(7);
    const model3 = new ArrayTableModel();
    model3.addRow([1, 2]);
    model3.addRow([3, 4]);
    model3.addRow([5, 6]);
    model3.addRow([7, 8]);
    const translatedTable3 = new TranslatedTableModel(model3);
    translatedTable3.moveRow(1, 3);
    model3.addRow([0,0]);
    Expect(translatedTable3.get(0, 0)).toEqual(1);
    Expect(translatedTable3.get(1, 0)).toEqual(5);
    Expect(translatedTable3.get(2, 0)).toEqual(7);
    Expect(translatedTable3.get(3, 0)).toEqual(3);
    Expect(translatedTable3.get(4, 0)).toEqual(0);
  }

  /** Tests when a row is removed from the original model. */
  @Test()
  public testSignalListeningRemove(): void {
    const model = new ArrayTableModel();
    model.addRow([1, 2]);
    model.addRow([3, 4]);
    model.addRow([5, 6]);
    model.addRow([7, 8]);
    const translatedTable = new TranslatedTableModel(model);
    translatedTable.moveRow(2, 0);
    model.removeRow(1);
    model.get(0,0);
    translatedTable.get(0, 0);
    Expect(translatedTable.get(0, 0)).toEqual(5);
    Expect(translatedTable.get(1, 0)).toEqual(1);
    Expect(translatedTable.get(2, 0)).toEqual(7);
  }

  /** Tests when a cell is updated in the original model. */
  @Test()
  public testUpdatedValues(): void {
    const model = new ArrayTableModel();
    model.addRow([0, 0]);
    model.addRow([1, 1]);
    model.addRow([2, 2]);
    model.addRow([3, 3]);
    const translatedTable = new TranslatedTableModel(model);
    translatedTable.moveRow(2, 0);
    model.set(0, 0, 9);
    model.set(0, 1, 9);
    Expect(translatedTable.get(0, 0)).toEqual(2);
    Expect(translatedTable.get(0, 1)).toEqual(2);
    Expect(translatedTable.get(1, 0)).toEqual(9);
    Expect(translatedTable.get(1, 1)).toEqual(9);
  }

  /** Tests the signals that translated table model sends. */
  @Test()
  public testChildTable(): void {
    const model = new ArrayTableModel();
    const translatedTable = new TranslatedTableModel(model);
    model.addRow([0,0,0]);
    model.addRow([1,1,1]);
    model.addRow([2,2,2]);
    translatedTable.moveRow(2, 1);
    const translatedTable2 = new TranslatedTableModel(translatedTable);
    const slot = (operations: Operation[]) => {
      console.log(operations);
      Expect(operations.length).toEqual(3);
      if(operations) {
        if(operations[0] instanceof AddRowOperation &&
          operations[1] instanceof UpdateValueOperation &&
          operations[2] instanceof RemoveRowOperation) {
            Expect(true).toEqual(true);
        }
      } else {
        Expect(false).toEqual(true);
      }
    };
    const listener = translatedTable2.connect(slot);
    model.beginTransaction();
    model.addRow([4, 4, 4]);
    model.beginTransaction();
    model.set(0, 1, 10);
    model.endTransaction();
    model.removeRow(1);
    model.endTransaction();
    listener.unlisten();
    Expect(translatedTable2.get(0, 0)).toEqual(0);
    Expect(translatedTable2.get(0, 1)).toEqual(10);
    Expect(translatedTable2.get(1, 0)).toEqual(2);
    Expect(translatedTable2.get(2, 0)).toEqual(4);
  }
}
