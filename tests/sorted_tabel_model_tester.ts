import { Expect, Test } from 'alsatian';
import { AddRowOperation, ArrayTableModel, ColumnOrder, Comparator, Operation,
  RemoveRowOperation, SortOrder, SortedTableModel,  TranslatedTableModel }
  from '../source';

/** Tests the SortedTableModel. */
export class SortedTableModelTester {

  /** Tests that the number of rows is correct. */
  @Test()
  public testRowCount(): void {
    const sortedTable = new SortedTableModel(
      new TranslatedTableModel(new ArrayTableModel()));
    Expect(sortedTable.rowCount).toEqual(0);
    const model = new ArrayTableModel();
    model.addRow([1]);
    model.addRow([6]);
    model.addRow([7]);
    const sortedTable2 = new SortedTableModel(model);
    Expect(sortedTable2.rowCount).toEqual(3);
  }

  /** Tests that the number of columns is correct. */
  @Test()
  public testColumnCount(): void {
    const sortedTable = new SortedTableModel(
      new TranslatedTableModel(new ArrayTableModel()));
    Expect(sortedTable.columnCount).toEqual(0);
    const model = new ArrayTableModel();
    model.addRow([1, 9]);
    model.addRow([6, 4]);
    model.addRow([7, 2]);
    const sortedTable2 = new SortedTableModel(model);
    Expect(sortedTable2.columnCount).toEqual(2);

  }

  /** Tests that get works correctly. */
  @Test()
  public testGet(): void {
    const model = new ArrayTableModel();
    model.addRow([1, 2, 3, 4, 5]);
    model.addRow([6, 7, 8, 9, 10]);
    const sortedTable = new SortedTableModel(model);
    Expect(sortedTable.get(0,1)).toEqual(2);
    Expect(sortedTable.get(1,3)).toEqual(9);
  }

  /** Tests that the elements are in the correct order when the a
    new table is created. */
  @Test()
  public testSorting(): void {
    const orders = [new ColumnOrder(0, SortOrder.ASCENDING),
      new ColumnOrder(1, SortOrder.DESCENDING)];
    const comp = new Comparator();
    const model = new ArrayTableModel();
    model.addRow([2, 3]);
    model.addRow([2, 9]);
    model.addRow([1, 7]);
    model.addRow([3, 9]);
    const sortedTable = new SortedTableModel(model, comp, orders);
    Expect(sortedTable.get(0, 0)).toEqual(1);
    Expect(sortedTable.get(1, 0)).toEqual(2);
    Expect(sortedTable.get(2, 0)).toEqual(2);
    Expect(sortedTable.get(3, 0)).toEqual(3);
    Expect(sortedTable.get(0, 1)).toEqual(7);
    Expect(sortedTable.get(1, 1)).toEqual(9);
    Expect(sortedTable.get(2, 1)).toEqual(3);
    Expect(sortedTable.get(3, 1)).toEqual(9);
    Expect(sortedTable.columnCount).toEqual(2);
    Expect(sortedTable.rowCount).toEqual(4);
    const orders2 = [new ColumnOrder(0, SortOrder.ASCENDING)];
    const model2 = new ArrayTableModel();
    model2.addRow(['a', 2]);
    model2.addRow(['z', 9]);
    model2.addRow(['z', 9]);
    model2.addRow(['z', 7]);
    model2.addRow(['q', 9]);
    const sortedTable2 = new SortedTableModel(model2, comp, orders2);
    Expect(sortedTable2.get(0, 0)).toEqual('a');
    Expect(sortedTable2.get(1, 0)).toEqual('q');
    Expect(sortedTable2.get(2, 0)).toEqual('z');
    Expect(sortedTable2.get(3, 0)).toEqual('z');
    Expect(sortedTable2.get(4, 0)).toEqual('z');
    const orders3 = [new ColumnOrder(1, SortOrder.DESCENDING)];
    sortedTable2.columnOrder = orders3;
    Expect(sortedTable2.get(0, 1)).toEqual(9);
    Expect(sortedTable2.get(1, 1)).toEqual(9);
    Expect(sortedTable2.get(2, 1)).toEqual(9);
    Expect(sortedTable2.get(3, 1)).toEqual(7);
    Expect(sortedTable2.get(4, 1)).toEqual(2);
  }

  /** Tests the behavior when the table receives a row removed signal. */
  @Test()
  public testReceiveRemove(): void {
    const model = new ArrayTableModel();
    model.addRow([1]);
    model.addRow([6]);
    model.addRow([7]);
    const sortedTable = new SortedTableModel(model);
    model.removeRow(1);
    Expect(sortedTable.rowCount).toEqual(2);
    Expect(sortedTable.get(0, 0)).toEqual(1);
    Expect(sortedTable.get(1, 0)).toEqual(7);
    Expect(sortedTable.rowCount).toEqual(2);
    model.removeRow(0);
    Expect(sortedTable.get(0, 0)).toEqual(7);
    Expect(sortedTable.rowCount).toEqual(1);
  }

  /** Tests the behavior when the table receives a row added signal. */
  @Test()
  public testReceiveAdd(): void {
    const model = new ArrayTableModel();
    const comp = new Comparator();
    model.addRow([1]);
    model.addRow([6]);
    model.addRow([7]);
    const orders = [new ColumnOrder(0, SortOrder.ASCENDING)];
    const sortedTable = new SortedTableModel(model, comp, orders);
    model.addRow([9]);
    Expect(sortedTable.get(0, 0)).toEqual(1);
    Expect(sortedTable.get(1, 0)).toEqual(6);
    Expect(sortedTable.get(2, 0)).toEqual(7);
    Expect(sortedTable.get(3, 0)).toEqual(9);
    Expect(sortedTable.rowCount).toEqual(4);
    model.addRow([1]);
    Expect(sortedTable.get(0, 0)).toEqual(1);
    Expect(sortedTable.get(1, 0)).toEqual(1);
    Expect(sortedTable.get(2, 0)).toEqual(6);
    Expect(sortedTable.get(3, 0)).toEqual(7);
    Expect(sortedTable.get(4, 0)).toEqual(9);
    Expect(sortedTable.rowCount).toEqual(5);
    model.addRow([10], 0);
    Expect(sortedTable.get(0, 0)).toEqual(1);
    Expect(sortedTable.get(1, 0)).toEqual(1);
    Expect(sortedTable.get(2, 0)).toEqual(6);
    Expect(sortedTable.get(3, 0)).toEqual(7);
    Expect(sortedTable.get(4, 0)).toEqual(9);
    Expect(sortedTable.get(5, 0)).toEqual(10);
    Expect(sortedTable.rowCount).toEqual(6);
    model.addRow([5], 3);
    Expect(sortedTable.get(0, 0)).toEqual(1);
    Expect(sortedTable.get(1, 0)).toEqual(1);
    Expect(sortedTable.get(2, 0)).toEqual(5);
    Expect(sortedTable.get(3, 0)).toEqual(6);
    Expect(sortedTable.get(4, 0)).toEqual(7);
    Expect(sortedTable.get(5, 0)).toEqual(9);
    Expect(sortedTable.get(6, 0)).toEqual(10);
    Expect(sortedTable.rowCount).toEqual(7);
  }

  /** Tests signals that are sent when a row is removed. */
  @Test()
  public testRemoveRowSignal(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([2]);
    const orders = [new ColumnOrder(0, SortOrder.ASCENDING)];
    const comp = new Comparator();
    const sortedTable = new SortedTableModel(model, comp, orders);
    let signalsReceived = 0;
    const makeListener = (expectedRow: number) => {
      return (operations: Operation[]) => {
        Expect(operations.length).toEqual(1);
        const operation = operations[0] as RemoveRowOperation;
        Expect(operation).not.toBeNull();
        Expect(operation.index).toEqual(expectedRow);
        ++signalsReceived;
      };
    };
    let listener = sortedTable.connect(makeListener(0));
    model.removeRow(0);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
    listener = sortedTable.connect(makeListener(3));
    model.removeRow(2);
    Expect(signalsReceived).toEqual(2);
    listener.unlisten();
  }

  /** Tests signals that are sent when row is added. */
  @Test()
  public testAddRowSignal(): void {
    const model = new ArrayTableModel();
    model.addRow([2]);
    model.addRow([0]);
    model.addRow([1]);
    const orders = [new ColumnOrder(0, SortOrder.ASCENDING)];
    const comp = new Comparator();
    const sortedTable = new SortedTableModel(model, comp, orders);
    let signalsReceived = 0;
    const makeListener = (expectedRow: number) => {
      return (operations: Operation[]) => {
        Expect(operations.length).toEqual(1);
        const operation = operations[0] as AddRowOperation;
        Expect(operation).not.toBeNull();
        Expect(operation.index).toEqual(expectedRow);
        ++signalsReceived;
      };
    };
    let listener = sortedTable.connect(makeListener(2));
    model.addRow([1.5]);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
    listener = sortedTable.connect(makeListener(4));
    model.addRow([4], 1);
    Expect(signalsReceived).toEqual(2);
    listener.unlisten();
  }

  @Test()
  public testManyAdds(): void {
    const model = new ArrayTableModel();
    model.addRow([0, 8]);
    model.addRow([1, 4]);
    const orders = [new ColumnOrder(1, SortOrder.ASCENDING)];
    const comp = new Comparator();
    const sortedTable = new SortedTableModel(model, comp, orders);
    model.addRow([2, 136], 0);
    model.addRow([3, 102], 1);
    model.addRow([4, 170], 2);
    model.addRow([5, 155], 1);
    Expect(sortedTable.get(0, 1)).toEqual(4);
    Expect(sortedTable.get(1, 1)).toEqual(8);
    Expect(sortedTable.get(2, 1)).toEqual(102);
    Expect(sortedTable.get(3, 1)).toEqual(136);
    Expect(sortedTable.get(4, 1)).toEqual(155);
    Expect(sortedTable.get(5, 1)).toEqual(170);
  }

  @Test()
  public infiniteLoop(): void {
    const model = new ArrayTableModel();
    model.addRow([0, 7]);
    model.addRow([1, 4]);
    const orders = [new ColumnOrder(1, SortOrder.ASCENDING)];
    const comp = new Comparator();
    const sortedTable = new SortedTableModel(model, comp, orders);
    model.addRow([2, 153], 0);
    model.addRow([3, 114], 0);
    model.addRow([4, 158], 2);
    model.addRow([5, 122], 3);
    model.addRow([6, 117], 0);
    model.addRow([7, 119], 2);
    model.addRow([8, 170], 3);
    model.addRow([9, 107], 0);
  }
}
