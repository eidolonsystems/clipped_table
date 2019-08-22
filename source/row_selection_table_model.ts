import * as Kola from 'kola-signals';
import { ArrayTableModel } from './array_table_model';
import { TableModel } from './table_model';
import { AddRowOperation, MoveRowOperation, Operation }
  from './operations';

/** Provides the functionality needed to select Rows. */
export class RowSelectionTableModel extends TableModel {

  /** Constructs a RowSelectionTableModel.
   * @param table - The table whose rows are being selected.
   */
  constructor(table: TableModel) {
    super();
    this.selectedRows = new ArrayTableModel();
    for(let i = 0; i < table.rowCount; ++i) {
      this.selectedRows.addRow([i === 0]);
    }
    this.highlightedRow = 0;
    this.previousRow = 0;
    this.currentRow = 0;
    this.isShiftDown = false;
    this.isCtrlDown  = false;
    this.isMouseDown = false;
    this.isUpDown = false;
    this.isDownDown  = false;
    this.isAdding = true;
    table.connect(this.handleOperations.bind(this));
    this.s0();
  }

  public get rowCount(): number {
    return this.selectedRows.rowCount;
  }

  public get columnCount(): number {
    return 1;
  }

  public connect(slot: (operations: Operation[]) => void):
      Kola.Listener<Operation[]> {
    return this.selectedRows.connect(slot);
  }

  public get(row: number, column: number): boolean {
    return this.selectedRows.get(row, column);
  }

  /** Handles the cursor entering a new row.
   * @param row - The row the cursor entered.
   */
  public onMouseEnter(row: number): void {
    if(this.isMouseDown) {
      this.currentRow = row;
      if(this.state === 2) {
        return this.s2();
      } else if(this.state === 4) {
        return this.s4();
      } else if(this.state === 6) {
        return this.s6();
      }
    }
  }

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   * @param row - The row it was pressed inside of.
   */
  public onMouseDown(event: PointerEvent, row: number): void {
    if(event.button === 0) {
      this.isMouseDown = true;
      this.currentRow = row;
      if(this.state === 0) {
        return this.s0();
      } else if(this.state === 2) {
        return this.s2();
      }
    }
  }

  /** Handles releasing a mouse button.
   * @param event - The event describing the button release.
   */
  public onMouseUp(event: PointerEvent): void {
    if(event.button === 0) {
      this.isMouseDown = false;
      if(this.state === 2) {
        return this.s2();
      } else if(this.state === 4) {
        return this.s0();
      } else if(this.state === 6) {
        return this.s0();
      }
    }
  }

  /** Handles a keyboard button being pressed down.
   * @param event - The event describing the keyboard press.
   */
  public onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    if(keyCode === 38) {
      this.isUpDown = true;
      if(this.currentRow > 0) {
        --this.currentRow;
      }
      if(this.state === 0) {
        return this.s0();
      } else if(this.state === 2) {
        return this.s2();
      } else if(this.state === 4) {
        return this.s4();
      } else if(this.state === 7) {
        return this.s7();
      }
    } else if(keyCode === 40) {
      this.isDownDown = true;
      if(this.currentRow < this.selectedRows.rowCount - 1) {
        ++this.currentRow;
      }
      if(this.state === 0) {
        return this.s0();
      } else if(this.state === 2) {
        return this.s2();
      } else if(this.state === 4) {
        return this.s4();
      } else if(this.state === 7) {
        return this.s7();
      }
    } else if(keyCode === 16) {
      this.isShiftDown = true;
      if(this.state === 0) {
        return this.s0();
      } else if(this.state === 4) {
        return this.s0();
      } else if(this.state === 6) {
        return this.s0();
      } else if(this.state === 7) {
        return this.s0();
      }
    } else if(keyCode === 17) {
      this.isCtrlDown = true;
      if(this.state === 0) {
        return this.s0();
      } else if(this.state === 7) {
        return this.s0();
      }
    }
  }

  /** Handles a keyboard button going up after a press down.
   * @param event - The event describing the keyboard press.
   */
  public onKeyUp(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    if(keyCode === 38) {
      this.isUpDown = false;
      if(this.state === 4) {
        return this.s0();
      } else if(this.state === 7) {
        return this.s0();
      }
    } else if(keyCode === 40) {
      this.isDownDown = false;
      if(this.state === 4) {
        return this.s0();
      } else if(this.state === 7) {
        return this.s0();
      }
    } else if(keyCode === 16) {
      this.isShiftDown = false;
      if(this.state === 2) {
        return this.s2();
      }
    } else if(keyCode === 17) {
      this.isCtrlDown = false;
      if(this.state === 4) {
        return this.s0();
      }
    }
  }

  private c0() {
    return this.isShiftDown &&
      (this.isMouseDown || this.isDownDown || this.isUpDown);
  }

  private c1() {
    return this.isCtrlDown && this.isMouseDown;
  }

  private c2() {
    return !this.isShiftDown && !this.isCtrlDown && this.isMouseDown;
  }

  private c3() {
    return !this.isShiftDown && !this.isCtrlDown &&
      (this.isDownDown || this.isUpDown);
  }

  private c4() {
    return !this.isMouseDown && !this.isShiftDown;
  }

  private s0() {
    this.state = 0;
    if(!this.isMouseDown && !this.isDownDown && !this.isUpDown) {
      this.currentRow = this.highlightedRow;
    }
    if(this.c0()) {
      return this.s1();
    } else if(this.c1()) {
      return this.s3();
    } else if(this.c2()) {
      return this.s5();
    } else if(this.c3()) {
      return this.s7();
    }
  }

  private s1() {
    this.state = 1;
    this.clearRows();
    this.previousRow = this.highlightedRow;
    this.isAdding = true;
    return this.s2();
  }

  private s2() {
    this.state = 2;
    this.toggleRows();
    if(this.c4()) {
      this.s0();
      return;
    }
  }

  private s3() {
    this.state = 3;
    this.highlightedRow = this.currentRow;
    this.previousRow = this.currentRow;
    this.isAdding = !this.selectedRows.get(this.currentRow, 0);
    return this.s4();
  }

  private s4() {
    this.state = 4;
    this.toggleRows();
  }

  private s5() {
    this.state = 5;
    this.clearRows();
    this.isAdding = true;
    this.highlightedRow = this.currentRow;
    this.previousRow = this.currentRow;
    return this.s6();
  }

  private s6() {
    this.state = 6;
    this.toggleRows();
  }

  private s7() {
    this.state = 7;
    this.clearRows();
    this.highlightedRow = this.currentRow;
    this.selectedRows.set(this.highlightedRow, 0, true);
  }

  private handleOperations(newOperations: Operation[]): void {
    this.selectedRows.beginTransaction();
    for(const operation of newOperations) {
      if(operation instanceof AddRowOperation) {
        if(this.selectedRows.rowCount === 0) {
          this.selectedRows.addRow([true]);
          this.highlightedRow = 0;
          this.currentRow = 0;
          this.previousRow = 0;
        } else {
          this.selectedRows.addRow([false], operation.index);
        }
        const row = new ArrayTableModel();
        row.addRow([false]);
      } else if(operation instanceof MoveRowOperation) {
        this.selectedRows.moveRow(operation.source, operation.destination);
      }
    }
    this.selectedRows.endTransaction();
  }

  private clearRows() {
    this.selectedRows.beginTransaction();
    for(let i = 0; i < this.selectedRows.rowCount; ++i) {
      this.selectedRows.set(i, 0, false);
    }
    this.selectedRows.endTransaction();
  }

  private toggleRows() {
    if(this.highlightedRow <= this.previousRow &&
        this.previousRow <= this.currentRow) {
      for(let i = this.previousRow; i <= this.currentRow; ++i) {
        this.selectedRows.set(i, 0, this.isAdding);
      }
    } else if(this.highlightedRow <= this.currentRow &&
        this.currentRow < this.previousRow) {
      for(let i = this.previousRow; i > this.currentRow; --i) {
        this.selectedRows.set(i, 0, !this.isAdding);
      }
    } else if(this.currentRow <= this.previousRow &&
        this.previousRow <= this.highlightedRow) {
      for(let i = this.currentRow; i <= this.previousRow; ++i) {
        this.selectedRows.set(i, 0, this.isAdding);
      }
    } else if(this.previousRow < this.currentRow &&
        this.currentRow <= this.highlightedRow) {
      for(let i = this.previousRow; i < this.currentRow; ++i) {
        this.selectedRows.set(i, 0, !this.isAdding);
      }
    }
    this.previousRow = this.currentRow;
  }

  private state: number;
  private selectedRows: ArrayTableModel;
  private highlightedRow: number;
  private previousRow: number;
  private currentRow: number;
  private isShiftDown: boolean;
  private isCtrlDown: boolean;
  private isMouseDown: boolean;
  private isUpDown: boolean;
  private isDownDown: boolean;
  private isAdding: boolean;
}
