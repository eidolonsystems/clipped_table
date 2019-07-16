import * as Kola from 'kola-signals';
import { Operation } from './operations';
import { TableModel } from './table_model';

export class FilteredTableModel extends TableModel {

  /** Constructs a FilteredTableModel.
   * @param source - The underlying model to filter.
   */
  public constructor(model: TableModel) {
    super();
    this.model = model;
    this.length = 0;
    this.filter();
  }

  public get rowCount(): number {
    return this.length;
  }

  public get columnCount(): number {
    return this.model.columnCount;
  }

  public get(row: number, column: number) {
    throw new Error("Method not implemented.");
  }
  public connect(slot: (operations: Operation[]) => void):
    Kola.Listener<Operation[]> {
    throw new Error("Method not implemented.");
  }

  private filter() {
    this.visiblity = [];
    for(let i = 0; i < this.model.rowCount; ++i) {
      if(true) {
        this.visiblity.push(true);
        this.length++;
      } else {
        this.visiblity.push(false);
      }
    }
  }



  private model: TableModel;
  private visiblity: boolean[];
  private length: number;
}
