import { Expect, Test } from 'alsatian';
import { SortedTableModel,  TranslatedTableModel, ArrayTableModel,
  ColumnOrder, SortOrder, Comparator } from '../source';

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
    console.log('ADDED AND SORTED.');
    Expect(sortedTable.get(0, 0)).toEqual(1);
    Expect(sortedTable.get(1, 0)).toEqual(6);
    Expect(sortedTable.get(2, 0)).toEqual(7);
    Expect(sortedTable.get(3, 0)).toEqual(9);
    ///
    model.addRow([0]);
    Expect(sortedTable.get(0, 0)).toEqual(0);
    Expect(sortedTable.get(1, 0)).toEqual(1);
    Expect(sortedTable.get(2, 0)).toEqual(6);
    Expect(sortedTable.get(3, 0)).toEqual(7);
    Expect(sortedTable.get(4, 0)).toEqual(9);

    model.addRow([10], 0);
    Expect(sortedTable.get(0, 0)).toEqual(0);
    Expect(sortedTable.get(1, 0)).toEqual(1);
    Expect(sortedTable.get(2, 0)).toEqual(6);
    Expect(sortedTable.get(3, 0)).toEqual(7);
    Expect(sortedTable.get(4, 0)).toEqual(9);
    Expect(sortedTable.get(5, 0)).toEqual(10);
  }
}
