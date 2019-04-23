import { Expect, Test } from 'alsatian';
import { AddRowOperation, SortedTableModel, MoveRowOperation , Operation,
  RemoveRowOperation, TranslatedTableModel,
  UpdateValueOperation, ArrayTableModel, ColumnOrder, SortOrder, Comparator } from '../source';

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
    const orders = [new ColumnOrder(1, SortOrder.ASCENDING),
      new ColumnOrder(2, SortOrder.DESCENDING)];
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
  }

  /** Tests the behavior when the table recives a row added signal. */
  @Test()
  public testReceiveAdd(): void {
    const orders = [new ColumnOrder(1, SortOrder.ASCENDING)];
    const comp = new Comparator();
    const model = new ArrayTableModel();
    model.addRow([2]);
    model.addRow([5]);
    model.addRow([4]);
    const sortedTable = new SortedTableModel(model, comp, orders);
    Expect(sortedTable.get(0, 0)).toEqual(2);
    Expect(sortedTable.get(1, 0)).toEqual(4);
    Expect(sortedTable.get(2, 0)).toEqual(5);
    model.addRow([3]);
    Expect(sortedTable.get(0, 0)).toEqual(2);
    Expect(sortedTable.get(1, 0)).toEqual(3);
    Expect(sortedTable.get(2, 0)).toEqual(4);
    Expect(sortedTable.get(3, 0)).toEqual(5);
  }

  /** Tests the behavior when the table recives a row removed signal. */
  @Test()
  public testReciveRemove(): void {
    const model = new ArrayTableModel();
    model.addRow([1]);
    model.addRow([6]);
    model.addRow([7]);
    const sortedTable = new SortedTableModel(model);
    model.removeRow(1);
    Expect(sortedTable.rowCount).toEqual(2);
    Expect(sortedTable.get(0, 0)).toEqual(1);
    Expect(sortedTable.get(0, 1)).toEqual(7);
  }

  /** Tests the behavior when the table recives a row update signal. */
  @Test()
  public testReciveUpdate(): void {
    const orders = [new ColumnOrder(1, SortOrder.ASCENDING)];
    const comp = new Comparator();
    const model = new ArrayTableModel();
    model.addRow([2]);
    model.addRow([5]);
    model.addRow([4]);
    const sortedTable = new SortedTableModel(model, comp, orders);
    Expect(sortedTable.get(0, 0)).toEqual(2);
    Expect(sortedTable.get(1, 0)).toEqual(4);
    Expect(sortedTable.get(2, 0)).toEqual(5);
    model.set(1, 0, 9);
    Expect(sortedTable.get(0, 0)).toEqual(2);
    Expect(sortedTable.get(1, 0)).toEqual(4);
    Expect(sortedTable.get(2, 0)).toEqual(9);
  }
}
