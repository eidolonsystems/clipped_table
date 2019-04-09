import { Expect, Test } from 'alsatian';
import { ArrayTableModel, AddRowOperation, MoveRowOperation , Operation,
  RemoveRowOperation, TranslatedTableModel, UpdateValueOperation }
  from '../source';

/** Tests the TranslatedTableModel. */
export class TranslatedTableModelTester {

  /** Tests if the number of rows is correct */
  @Test()
  public testRowCount(): void {
    const translatedTable = new TranslatedTableModel(new ArrayTableModel());
    Expect(translatedTable.rowCount).toEqual(0);
    const model = new ArrayTableModel();
    model.addRow([1]);
    model.addRow([4]);
    model.addRow([7]);
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

  /** Tests the move function. */
  @Test()
  public testMoveRow(): void {
    const model = new ArrayTableModel();
    model.addRow([1]);
    model.addRow([3]);
    model.addRow([5]);
    model.addRow([7]);
    model.addRow([9]);
    const translatedTable = new TranslatedTableModel(model);
    Expect(() => translatedTable.moveRow(-1, 3)).toThrow();
    Expect(() => translatedTable.moveRow(10, 3)).toThrow();
    Expect(() => translatedTable.moveRow(5, 3)).toThrow();
    Expect(() => translatedTable.moveRow(0, 5)).toThrow();
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

  /** Tests when a row is added to the original model. */
  @Test()
  public testReceiveAdd(): void {
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
  public testReceiveRemove(): void {
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
  public testReceiveUpdateValue(): void {
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

   /** Tests signals when value is updated. */
  @Test()
  public testUpdateValueSignal(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    const translatedTable = new TranslatedTableModel(model);
    translatedTable.moveRow(2, 1);
    let signalsReceived = 0;
    const makeListener = (expectedRow: number) => {
      return (operations: Operation[]) => {
        Expect(operations.length).toEqual(1);
        const operation = operations[0] as UpdateValueOperation;
        Expect(operation).not.toBeNull();
        Expect(operation.row).toEqual(expectedRow);
        ++signalsReceived;
      };
    };
    let listener = translatedTable.connect(makeListener(1));
    model.set(2, 0, 9);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
    listener = translatedTable.connect(makeListener(0));
    model.set(0, 0, 8);
    Expect(signalsReceived).toEqual(2);
    listener.unlisten();
  }

  /** Tests signals when row is added. */
  @Test()
  public testAddRowSignal(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    const translatedTable = new TranslatedTableModel(model);
    translatedTable.moveRow(2, 1);
    let signalsReceived = 0;
    const makeListener = (expectedRow: number) => {
      return (operations: Operation[]) => {
        Expect(operations.length).toEqual(1);
        const operation = operations[0] as AddRowOperation;
        Expect(operation).not.toBeNull();
        Expect(operation.row instanceof TranslatedTableModel).toEqual(true);
        Expect(operation.index).toEqual(expectedRow);
        ++signalsReceived;
      };
    };
    let listener = translatedTable.connect(makeListener(3));
    model.addRow([3]);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
    listener = translatedTable.connect(makeListener(2));
    model.addRow([4], 1);
    Expect(signalsReceived).toEqual(2);
    listener.unlisten();
    listener = translatedTable.connect(makeListener(0));
    model.addRow([5], 0);
    Expect(signalsReceived).toEqual(3);
    listener.unlisten();
  }

  /** Tests signals sent when a row is removed. */
  @Test()
  public testRemoveRowSignal(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    const translatedTable = new TranslatedTableModel(model);
    translatedTable.moveRow(4, 1);
    let signalsReceived = 0;
    const makeListener = (expectedRow: number) => {
      return (operations: Operation[]) => {
        Expect(operations.length).toEqual(1);
        const operation = operations[0] as RemoveRowOperation;
        Expect(operation).not.toBeNull();
        Expect(operation.row instanceof TranslatedTableModel).toEqual(true);
        Expect(operation.index).toEqual(expectedRow);
        ++signalsReceived;
      };
    };
    let listener = translatedTable.connect(makeListener(1));
    model.removeRow(4);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
    listener = translatedTable.connect(makeListener(0));
    model.removeRow(0);
    Expect(signalsReceived).toEqual(2);
    listener.unlisten();
  }

  /** Tests signal sent when a row is moved around. */
  @Test()
  public testMoveRowSignal(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    const translatedTable = new TranslatedTableModel(model);
    let signalsReceived = 0;
    const makeListener = (sourceRow: number, destinationRow: number) => {
      return (operations: Operation[]) => {
        Expect(operations.length).toEqual(1);
        const operation = operations[0] as MoveRowOperation;
        Expect(operation).not.toBeNull();
        Expect(operation.source).toEqual(sourceRow);
        Expect(operation.destination).toEqual(destinationRow);
        ++signalsReceived;
      };
    };
    const listener = translatedTable.connect(makeListener(4, 1));
    translatedTable.moveRow(4, 1);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
  }
}
