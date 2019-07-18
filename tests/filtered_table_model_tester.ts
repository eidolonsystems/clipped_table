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
  public testUpdateToTrue(): void {
    const model = new ArrayTableModel();
    model.addRow([-6]);
    model.addRow([1]);
    model.addRow([-6]);
    model.addRow([6]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(2);
    Expect(model.get(1, 0)).toEqual(1);
    Expect(filterTable.get(0, 0)).toEqual(1);
    Expect(filterTable.get(1, 0)).toEqual(6);
    model.set(0, 0, 4);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(4);
    Expect(filterTable.get(1, 0)).toEqual(1);
    Expect(filterTable.get(2, 0)).toEqual(6);
    model.set(1, 0, -4);
  }
}
