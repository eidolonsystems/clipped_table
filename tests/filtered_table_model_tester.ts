import { Expect, Test } from 'alsatian';
import { ArrayTableModel }
  from '../source';
import { Predicate, FilteredTableModel } from '../source/filtered_table_model';

class MockPredicate implements Predicate {
  constructor(index: number) {
    this._index = index;
  }

  public get index(): number {
    return this._index;
  }

  public applyPredicate(data: any): boolean {
    if(data > 0) {
      return true;
    } else {
      return false;
    }
  }

  private _index: number;
}

/** Tests the FilteredTableModel. */
export class FilteredTableModelTester {

  /** Tests if the number of rows is correct */
  @Test()
  public testRowCount(): void {
    const model = new ArrayTableModel();
    model.addRow([-6]);
    model.addRow([1]);
    model.addRow([-6]);
    model.addRow([6]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(2);
  }

  /** Tests if the number of rows is correct */
  @Test()
  public testSimpleFiltering(): void {
    const model = new ArrayTableModel();
    model.addRow([-6]);
    model.addRow([1]);
    model.addRow([-6]);
    model.addRow([6]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(1);
    Expect(filterTable.get(1, 0)).toEqual(6);
  }

  /** Tests if the number of rows is correct */
  @Test()
  public testUpdateToTrue(): void {
    const model = new ArrayTableModel();
    model.addRow([-2]);
    model.addRow([1]);
    model.addRow([-8]);
    model.addRow([-3]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(1);
    Expect(filterTable.get(0, 0)).toEqual(1);
    model.set(0, 0, 4);
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(4);
    Expect(filterTable.get(1, 0)).toEqual(1);
    model.set(3, 0, 9);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(4);
    Expect(filterTable.get(1, 0)).toEqual(1);
    Expect(filterTable.get(2, 0)).toEqual(9);
    model.set(2, 0, 100);
    Expect(filterTable.rowCount).toEqual(4);
    Expect(filterTable.get(0, 0)).toEqual(4);
    Expect(filterTable.get(1, 0)).toEqual(1);
    Expect(filterTable.get(2, 0)).toEqual(100);
    Expect(filterTable.get(3, 0)).toEqual(9);
  }

  @Test()
  public testUpdateToFalse(): void {
    const model = new ArrayTableModel();
    model.addRow([4]);
    model.addRow([12]);
    model.addRow([22]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(4);
    model.set(0, 0, -1);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(12);
    Expect(filterTable.get(1, 0)).toEqual(22);
    Expect(filterTable.get(2, 0)).toEqual(9);
    model.set(2, 0, -34);
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(12);
    Expect(filterTable.get(1, 0)).toEqual(9);
    model.set(3, 0, -1);
    Expect(filterTable.rowCount).toEqual(1);
    Expect(filterTable.get(0, 0)).toEqual(12);
    model.set(1, 0, -11);
    Expect(filterTable.rowCount).toEqual(0);
  }

  @Test()
  public testUpdateFalseToFalse(): void {
    const model = new ArrayTableModel();
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(2);
    model.set(0, 0, -11);
    Expect(filterTable.rowCount).toEqual(2);
  }

  @Test()
  public testRemoveFalse(): void {
    const model = new ArrayTableModel();
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([9]);
    model.addRow([30]);
    model.addRow([-44]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    Expect(filterTable.get(2, 0)).toEqual(30);
    model.removeRow(1);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    Expect(filterTable.get(2, 0)).toEqual(30);
    model.removeRow(0);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    Expect(filterTable.get(2, 0)).toEqual(30);
    model.removeRow(3);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    Expect(filterTable.get(2, 0)).toEqual(30);
  }

  @Test()
  public testRemoveTrue(): void {
    const model = new ArrayTableModel();
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([9]);
    model.addRow([-55]);
    model.addRow([30]);
    model.addRow([-44]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    Expect(filterTable.get(2, 0)).toEqual(30);
    model.removeRow(2);
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(9);
    Expect(filterTable.get(1, 0)).toEqual(30);
    model.removeRow(2);
    Expect(filterTable.rowCount).toEqual(1);
    Expect(filterTable.get(0, 0)).toEqual(30);
    model.removeRow(3);
    Expect(filterTable.rowCount).toEqual(0);
  }

  @Test()
  public testManyRemoves(): void {
    const model = new ArrayTableModel();
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    model.addRow([9]);
    model.addRow([10]);
    model.addRow([11]);
    model.addRow([12]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(12);
  }

  @Test()
  public testAddFalse(): void {
    const model = new ArrayTableModel();
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    model.addRow([-19], 0);
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    model.addRow([-40]);
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
  }

  //@Test()
  public testAddTrue(): void {
    const model = new ArrayTableModel();
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    model.addRow([19], 0);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
  }
}
