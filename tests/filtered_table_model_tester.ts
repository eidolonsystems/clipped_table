import { Expect, Test } from 'alsatian';
import { Predicate, FilteredTableModel } from '../source/filtered_table_model';
import { AddRowOperation, ArrayTableModel, MoveRowOperation , Operation,
  RemoveRowOperation, TranslatedTableModel, UpdateValueOperation }
  from '../source';

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

  /** */
  @Test()
  public testEmptyArray(): void {
    const model = new ArrayTableModel();
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(0);
  }

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

  /**  */
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

  /** */
  @Test()
  public testReceiveUpdateFalseToTrue(): void {
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
  public testReceiveUpdateTrueToFalse(): void {
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
  public testReceiveUpdateFalseToFalse(): void {
    const model = new ArrayTableModel();
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([-30]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    model.set(0, 0, -11);
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
    model.set(3, 0, -90);
    Expect(filterTable.rowCount).toEqual(2);
    Expect(filterTable.get(0, 0)).toEqual(22);
    Expect(filterTable.get(1, 0)).toEqual(9);
  }

  @Test()
  public testReceiveUpdateTrueToTrue(): void {
    const model = new ArrayTableModel();
    model.addRow([4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([-30]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(4);
    Expect(filterTable.get(1, 0)).toEqual(22);
    Expect(filterTable.get(2, 0)).toEqual(9);
    model.set(0, 0, 50);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(50);
    Expect(filterTable.get(1, 0)).toEqual(22);
    Expect(filterTable.get(2, 0)).toEqual(9);
    model.set(4, 0, 2);
    Expect(filterTable.rowCount).toEqual(3);
    Expect(filterTable.get(0, 0)).toEqual(50);
    Expect(filterTable.get(1, 0)).toEqual(22);
    Expect(filterTable.get(2, 0)).toEqual(2);
  }

  @Test()
  public testReceiveRemoveFalse(): void {
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
  public testReceiveRemoveTrue(): void {
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
  public testReceiveManyRemoves(): void {
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
  public testReceiveAddFalse(): void {
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

  @Test()
  public testReceiveReceiveAddTrue(): void {
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
    Expect(filterTable.get(0, 0)).toEqual(19);
    Expect(filterTable.get(1, 0)).toEqual(22);
    Expect(filterTable.get(2, 0)).toEqual(9);
    model.addRow([50]);
    Expect(filterTable.rowCount).toEqual(4);
    Expect(filterTable.get(0, 0)).toEqual(19);
    Expect(filterTable.get(1, 0)).toEqual(22);
    Expect(filterTable.get(2, 0)).toEqual(9);
    Expect(filterTable.get(3, 0)).toEqual(50);
  }

  @Test()
  public testUpdateRowSignalTrueToTrue(): void {
    const model = new ArrayTableModel();
    model.addRow([23]);
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([-70]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    let signalsReceived = 0;
    const makeListener = (expectedRow: number) => {
      return (operations: Operation[]) => {
        Expect(operations.length).toEqual(1);
        const operation = operations[0] as UpdateValueOperation;
        Expect(operation).not.toBeNull();
        Expect(operation.row).toEqual(expectedRow);
        Expect(operation.column).toEqual(0);
        ++signalsReceived;
      };
    };
    let listener = filterTable.connect(makeListener(0));
    model.set(0, 0, 40);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
    listener = filterTable.connect(makeListener(1));
    model.set(3, 0, 100);
    Expect(signalsReceived).toEqual(2);
    listener.unlisten();
  }

  @Test()
  public testUpdateRowSignalFalseToFalse(): void {
    const model = new ArrayTableModel();
    model.addRow([23]);
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([-70]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
    let signalsReceived = 0;
    const makeListener = () => {
      return (operations: Operation[]) => {
        Expect(operations.length).toEqual(0);
        ++signalsReceived;
      };
    };
    const listener = filterTable.connect(makeListener());
    model.set(1, 0, -40);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
  }

  @Test()
  public testUpdateRowSignalTrueToFalse(): void {
    const model = new ArrayTableModel();
    model.addRow([23]);
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([-70]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
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
    let listener = filterTable.connect(makeListener(1));
    model.set(3, 0, -40);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
    listener = filterTable.connect(makeListener(0));
    model.set(0, 0, -33);
    Expect(signalsReceived).toEqual(2);
    listener.unlisten();
  }

  @Test()
  public testUpdateRowSignalFalseToTrue(): void {
    const model = new ArrayTableModel();
    model.addRow([23]);
    model.addRow([-4]);
    model.addRow([-12]);
    model.addRow([22]);
    model.addRow([-70]);
    model.addRow([9]);
    const filterTable = new FilteredTableModel(model, new MockPredicate(0));
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
    let listener = filterTable.connect(makeListener(2));
    model.set(4, 0, 90);
    Expect(signalsReceived).toEqual(1);
    listener.unlisten();
    listener = filterTable.connect(makeListener(1));
    model.set(1, 0, 11);
    Expect(signalsReceived).toEqual(2);
    listener.unlisten();
  }

  @Test()
  public testReceiveReceiveManyAdds(): void {
  }

  @Test()
  public testAddRowSignalTrue(): void {
  }

  @Test()
  public testAddRowSignalFalse(): void {
  }

  @Test()
  public testRemoveRowSignal(): void {
  }
}
