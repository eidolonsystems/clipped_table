import { ArrayTableModel } from "./array_table_model";
import {TableModel} from "./table_model";
import { AddRowOperation, MoveRowOperation, Operation,
  RemoveRowOperation, UpdateValueOperation } from './operations';

/** Provides the functionality needed to resize a table's columns. */
export class ColumnResizer {

  /** Constructs a ColumnResizer.
   * @param table - The interface to the table being resized.
   */
  constructor(table: TableModel) {
    this.isShiftDown = true;
    this.isCtrlDown  = true;
    this.isMouseDown = true;
    this.isUpDown = true;
    this.isDownDown  = true;
    this.isAdding = false;
    this.selectedRows = new ArrayTableModel();
    for(let i = 0; i < table.rowCount; ++i) {
      this.selectedRows.addRow([false]);
    }
    this.selectedRows.connect(this.handleOperations.bind(this));
    this.s0();
  }

  /** Handles the cursor moving. */
  public onMouseEnter(row: number) {
    if(this.isMouseDown) {
      this.previousRow = this.currentRow;
      this.currentRow = row;
    }
  }

  /** Handles pressing down a mouse button. */
  public onMouseDown(event: PointerEvent) {
    this.isMouseDown = true;
    if(this.state === 2) {
      this.s2();
    }
  }

  /** Handles releasing a mouse button. */
  public onMouseUp(event: PointerEvent) {
    this.isMouseDown = false;
    if(this.state === 2) {
      this.s2();
    } else if(this.state === 4) {
      this.s0();
    } else if(this.state === 6) {
      this.s0();
    }
  }

  public onKeyDown(keycode: number) {
    if(keycode === 38) { // arrow up
      this.isUpDown = true;
      if(this.state === 2) {
        this.s2();
      } else if(this.state === 4) {
        this.s4();
      } else if(this.state === 7) {
        this.s7();
      }
    } else if(keycode === 40) { // arrow down
      this.isDownDown = true;
      if(this.state === 2) {
        this.s2();
      } else if(this.state === 4) {
        this.s4();
      } else if(this.state === 7) {
        this.s7();
      }
    } else if(keycode === 16) { // shift
      this.isShiftDown = true;
      if(this.state === 4) {
        this.s0();
      } else if(this.state === 6) {
      this.s0();
      }
    } else if(keycode === 17) {
      this.isCtrlDown = true;
    }
  }

  public onKeyUp(keycode: number) {
    if(keycode === 38) { // arrow up
      this.isUpDown = false;
      if(this.state === 4) {
        this.s0();
      }
    } else if(keycode === 40) { // arrow down
      this.isDownDown = false;
      if(this.state === 4) {
        this.s0();
      }
    } else if(keycode === 16) { // shift
      this.isShiftDown = false;
      if(this.state === 2) {
        this.s2();
      }
    } else if(keycode === 17) {
      this.isCtrlDown = false;
      if(this.state === 4) {
        this.s0();
      }
    }
  }

  private C0() {
    return this.isShiftDown &&
      (this.isUpDown || this.isDownDown || this.isUpDown);
  }
  private C1() {
    return this.isCtrlDown &&
      (this.isUpDown || this.isDownDown || this.isUpDown);
  }
  private C2() {
    return !this.isShiftDown && !this.isCtrlDown && this.isMouseDown;
  }
  private C3() {
    return !this.isShiftDown && !this.isCtrlDown &&
      (this.isDownDown || this.isUpDown);
  }
  private C4() {
    return !this.isMouseDown && !this.isShiftDown;
  }

  private s0() {
    this.state = 0;
    if(this.C0()) {
      this.s1();
    } else if(this.C1()) {
      this.s3();
    } else if(this.C2()) {
      this.s5();
    } else if(this.C3()) {
      this.s7();
    }
  }

  private s1() {
    this.state = 1;
    this.clearTrueRows();
    this.previousRow = this.hilightedRow;
    this.s2();
  }

  private s2() {
    this.state = 2;
    this.toggleRows();
    if(this.C4()) {
      this.s0();
    }
  }

  private s3() {
    this.state = 3;
    this.hilightedRow = this.currentRow;
    this.previousRow = this.hilightedRow;
    if(this.selectedRows.get(this.currentRow, 0) === true) {
      this.isAdding = false;
    } else {
      this.isAdding = true;
    }
    this.s4();
  }

  private s4() {
    this.state = 4;
    this.toggleRows();
  }

  private s5() {
    this.state = 5;
    this.clearTrueRows();
    this.hilightedRow = this.currentRow;
    this.previousRow = this.hilightedRow;
    this.s6();
  }

  private s6() {
    this.state = 6;
    this.toggleRows();
  }

  private s7() {
    this.state = 7;
    this.clearTrueRows();
    this.hilightedRow = this.currentRow;
    this.selectedRows.set(this.hilightedRow, 0, true);
  }

  private handleOperations(newOperations: Operation[]): void {
    this.selectedRows.beginTransaction();
    for(const operation of newOperations) {
      if(operation instanceof AddRowOperation) {
        this.selectedRows.addRow([false], operation.index);
      } else if(operation instanceof RemoveRowOperation) {
        this.selectedRows.removeRow(operation.index);
      } else if(operation instanceof MoveRowOperation) {
        this.selectedRows.moveRow(operation.source, operation.destination);
      }
    }
    this.selectedRows.endTransaction();
  }

  private clearTrueRows() {
    for(let i = 0; i < this.selectedRows.rowCount; ++i) {
      if(this.selectedRows.get(i,0)) {
        this.selectedRows.set(i,0, false);
      }
    }
  }

  private toggleRows() {
    for(let i = this.previousRow; i <= this.currentRow; ++i) {
      if(this.isAdding && !this.selectedRows.get(i,0)) {
        this.selectedRows.set(i, 0, true);
      } else if(!this.isAdding && this.selectedRows.get(i,0)) {
        this.selectedRows.set(i, 0, false);
      }
    }
    this.previousRow = this.currentRow;
  }

  private state: number;
  private selectedRows: ArrayTableModel;
  private isShiftDown: boolean;
  private isCtrlDown: boolean;
  private isMouseDown: boolean;
  private isUpDown: boolean;
  private isDownDown: boolean;
  private isAdding: boolean;

  private hilightedRow: number;
  private previousRow: number;
  private currentRow: number;
}
