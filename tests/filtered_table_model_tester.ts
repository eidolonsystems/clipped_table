import { Expect, Test } from 'alsatian';
import { ArrayTableModel }
  from '../source';
import { Predicate, FilteredTableModel } from '../source/filtered_table_model';

class MockPredicate implements Predicate {
  public applyPredicate(row: any[]): boolean {
    if(row[0] > 0) {
      return true;
    } else {
      return false;
    }
  }
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
    const sortedTable = new FilteredTableModel(model, new MockPredicate());
    Expect(sortedTable.rowCount).toEqual(2);
  }
}
