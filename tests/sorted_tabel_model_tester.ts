import { Expect, Test } from 'alsatian';
import { AddRowOperation, SortedTableModel, MoveRowOperation , Operation,
  RemoveRowOperation, TranslatedTableModel,
  UpdateValueOperation, ArrayTableModel } from '../source';

export class SortedTableModelTester {

  @Test()
  public testRowCount(): void {
    const sortedTable = new SortedTableModel(
      new TranslatedTableModel(new ArrayTableModel()));
    Expect(sortedTable.rowCount).toEqual(0);
  }

  @Test()
  public testColumnCount(): void {
    const sortedTable = new SortedTableModel(
      new TranslatedTableModel(new ArrayTableModel()));
    Expect(sortedTable.columnCount).toEqual(0);

  }

  @Test()
  public testGet(): void {
    const model = new ArrayTableModel();
    model.addRow([1, 2, 3, 4, 5]);
    model.addRow([6, 7, 8, 9, 10]);
    const sortedTable = new SortedTableModel(model);
    Expect(sortedTable.get(0,1)).toEqual(2);
    Expect(sortedTable.get(1,3)).toEqual(9);
  }

  @Test()
  public testReceiveAdd(): void {
  }

  @Test()
  public testReciveRemove(): void {
  }

  @Test()
  public testReciveUpdate(): void {
  }
}