import { Expect, Test } from 'alsatian';
import { ArrayTableModel, MoveRowOperation,  Operation,
  TranslatedTableModel } from '../source';

/** Tests the TranslatedTableModel. */
export class TranslatedTableModelTester {

  /** Tests if the number of rows is correct */
  @Test()
  public testRowCount(): void {
    const model = new ArrayTableModel();
    const translatedTable = new TranslatedTableModel(model);
    Expect(translatedTable.rowCount).toEqual(0);
    model.addRow([1, 2 ,3]);
    model.addRow([4, 5, 6]);
    model.addRow([7, 8, 9]);
    const translatedTable2 = new TranslatedTableModel(model);
    Expect(translatedTable2.rowCount).toEqual(3);
  }

  /** Tests if the number of columns is corrrect. */
  @Test()
  public testColumnCount(): void {
    const model = new ArrayTableModel();
    const translatedTable = new TranslatedTableModel(model);
    Expect(translatedTable.columnCount).toEqual(0);
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
    const translatedTable = new TranslatedTableModel(model);
    model.addRow([1, 2, 3, 4, 5]);
    model.addRow([6, 7, 8, 9, 10]);
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
        console.log(operations);
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
    model.addRow([1, 2]);
    model.addRow([3, 4]);
    model.addRow([5, 6]);
    const translatedTable = new TranslatedTableModel(model);
    model.addRow([0, 0], 1);
    Expect(translatedTable.get(0, 0)).toEqual(1);
    Expect(translatedTable.get(1, 0)).toEqual(0);
    Expect(translatedTable.get(2, 0)).toEqual(3);
    Expect(translatedTable.get(3, 0)).toEqual(5);
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
    console.log(model);
    console.log(translatedTable);
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
}
