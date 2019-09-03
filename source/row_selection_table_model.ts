import * as Kola from 'kola-signals';
import { ArrayTableModel } from './array_table_model';
import { AddRowOperation, MoveRowOperation, Operation, RemoveRowOperation }
  from './operations';
import { TableModel } from './table_model';




/** Provides the functionality needed to select Rows. */
export class RowSelectionTableModel extends TableModel {

  /** Constructs a RowSelectionTableModel.
   * @param table - The table whose rows are being selected.
   */
  constructor(table: TableModel) {
    super();
    this.selectedRows = new ArrayTableModel();
    for(let i = 0; i < table.rowCount; ++i) {
      this.selectedRows.addRow([false]);
    }
    this.highlightedRow = -1;
    this.previousRow = 0;
    this.currentRow = 0;
    this.isShiftDownL = false;
    this.isShiftDownR = false;
    this.isCtrlDownL = false;
    this.isCtrlDownR = false;
    this.isCmdDownL = false;
    this.isCmdDownR = false;
    this.isMetaDownL = false;
    this.isMetaDownR = false;
    this.isMouseDown = false;
    this.isUpDown = false;
    this.isDownDown = false;
    this.isAdding = true;
    table.connect(this.handleOperations.bind(this));
    this.isACtrlKeyDown.bind(this);
    this.isAShiftKeyDown.bind(this);
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

  public getHilighted(): number {
    return this.highlightedRow;
  }

  public getCurrent(): number {
    return this.currentRow;
  }

  /** Handles the cursor entering a new row.
   * @param row - The row the cursor entered.
   */
  public onMouseEnter(row: number): void {
    if(this.isMouseDown) {
      this.currentRow = row;
      if(this.state === 4) {
        return this.s4();
      } else if(this.state === 6) {
        return this.s6();
      } else if(this.state === 8) {
        return this.s8();
      }
    }
  }

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   * @param row - The row it was pressed inside of.
   */
  public onMouseDown(event: React.MouseEvent<HTMLTableRowElement>,
      row: number): void {
    if(event.button === 0) {
      this.isMouseDown = true;
      this.currentRow = row;
      if(this.state === 0) {
        return this.s0();
      } else if(this.state === 4) {
        return this.s4();
      }
    }
  }

  /** Handles releasing a mouse button.
   * @param event - The event describing the button release.
   */
  public onMouseUp(event: MouseEvent): void {
    if(event.button === 0) {
      this.isMouseDown = false;
      if(this.state === 4) {
        return this.s4();
      } else if(this.state === 6) {
        return this.s0();
      } else if(this.state === 8) {
        return this.s0();
      }
    }
  }

  /** Handles a keyboard button being pressed down.
   * @param event - The event describing the keyboard press.
   */
  public onKeyDown(event: KeyboardEvent): void {
    const code = event.code;
    switch(code) {
      case 'ArrowUp':
        //event.preventDefault();
        this.isUpDown = true;
        if(this.currentRow > 0 && !this.isACtrlKeyDown()) {
          --this.currentRow;
        }
        if(this.state === 0) {
          return this.s0();
        } else if(this.state === 4) {
          return this.s4();
        } else if(this.state === 6) {
          return this.s6();
        } else if(this.state === 9) {
          return this.s9();
        }
        break;
      case 'ArrowDown':
        this.isDownDown = true;
        //event.preventDefault();
        if(this.currentRow < this.selectedRows.rowCount - 1 &&
            !this.isACtrlKeyDown()) {
          ++this.currentRow;
        }
        if(this.state === 0) {
          return this.s0();
        } else if(this.state === 4) {
          return this.s4();
        } else if(this.state === 6) {
          return this.s6();
        } else if(this.state === 9) {
          return this.s9();
        }
        break;
      case 'ShiftLeft':
        this.isShiftDownL = true;
        break;
      case 'ShiftRight':
        this.isShiftDownR = true;
        break;
      case 'ControlRight':
        this.isCtrlDownR = true;
        break;
      case 'ControlLeft':
        this.isCtrlDownL = true;
        break;
      case 'OSLeft':
        this.isCmdDownL = true;
        break;
      case 'OSRight':
        this.isCmdDownR = true;
        break;
      case 'MetaLeft':
        this.isMetaDownL = true;
        break;
      case 'MetaRight':
        this.isMetaDownR = true;
        break;
    }

    if(code === 'ShiftLeft' || code === 'ShiftRight') {
      if(this.state === 0) {
        return this.s0();
      } else if(this.state === 6) {
        return this.s0();
      } else if(this.state === 8) {
        return this.s0();
      } else if(this.state === 9) {
        return this.s0();
      }
    }
    if(this.isCtrlDownL || this.isCtrlDownR || this.isCmdDownL ||
      this.isCmdDownR || this.isMetaDownL || this.isMetaDownR) {
      if(this.state === 0) {
        return this.s0();
      }
    }
  }

  /** Handles a keyboard button going up after a press down.
   * @param event - The event describing the keyboard press.
   */
  public onKeyUp(event: KeyboardEvent): void {
    const code = event.code;
    switch(code) {
      case 'ArrowUp':
        this.isUpDown = false;
        if(this.state === 5) {
          return this.s0();
        } else if(this.state === 9) {
          return this.s0();
        }
        break;
      case 'ArrowDown':
        this.isDownDown = false;
        if(this.state === 5) {
          return this.s0();
        } else if(this.state === 9) {
          return this.s0();
        }
        break;
      case 'ShiftLeft':
        this.isShiftDownL = false;
        break;
      case 'ShiftRight':
        this.isShiftDownR = false;
        break;
      case 'ControlRight':
        this.isCtrlDownR = false;
        break;
      case 'ControlLeft':
        this.isCtrlDownL = false;
        break;
      case 'OSLeft':
        this.isCmdDownL = false;
        break;
      case 'OSRight':
        this.isCmdDownR = false;
        break;
      case 'MetaLeft':
        this.isMetaDownL = false;
        break;
      case 'MetaRight':
        this.isMetaDownR = false;
        break;
    }
    if(code === 'ShiftLeft' || code === 'ShiftRight' ) {
      if(this.state === 4) {
        return this.s4();
      }
    }
    if(this.isCtrlDownL || this.isCtrlDownR || this.isCmdDownL ||
      this.isCmdDownR || this.isMetaDownL || this.isMetaDownR) {
      if(this.state === 5) {
        return this.s0();
      }
    }
  }

  private c0() {
    return this.highlightedRow === -1 && this.isMouseDown;
  }

  private c1() {
    return this.highlightedRow === -1 &&
      (this.isUpDown || this.isDownDown);
  }

  private c2() {
    return this.isAShiftKeyDown() &&
      (this.isMouseDown || this.isDownDown || this.isUpDown);
  }

  private c3() {
    return this.isACtrlKeyDown() && this.isMouseDown;
  }

  private c4() {
    return !this.isAShiftKeyDown() && !this.isACtrlKeyDown()
      && this.isMouseDown;
  }

  private c5() {
    return !this.isAShiftKeyDown() && !this.isACtrlKeyDown() &&
      (this.isDownDown || this.isUpDown);
  }

  private c6() {
    return !this.isMouseDown && !this.isAShiftKeyDown();
  }

  private isACtrlKeyDown() {
    return (this.isCtrlDownL || this.isCtrlDownR || this.isCmdDownL ||
      this.isCmdDownR || this.isMetaDownL || this.isMetaDownR);
  }

  private isAShiftKeyDown() {
    return (this.isShiftDownL || this.isShiftDownR);
  }

  private s0() {
    this.state = 0;
    if(!this.isMouseDown && !this.isDownDown && !this.isUpDown) {
      this.currentRow = this.highlightedRow;
    }
    if(this.c0()) {
      return this.s1();
    } else if(this.c1()) {
      return this.s2();
    } else if(this.c2()) {
      return this.s3();
    } else if(this.c3()) {
      return this.s5();
    } else if(this.c4()) {
      return this.s7();
    } else if(this.c5()) {
      return this.s9();
    }
  }

  private s1() {
    this.state = 1;
    this.highlightedRow = this.currentRow;
    this.s0();
    return;
  }

  private s2() {
    this.state = 2;
    if(this.selectedRows.rowCount > 0) {
      this.highlightedRow = 0;
      this.currentRow = 0;
      this.previousRow = 0;
      this.clearRows();
    }
    this.s0();
    return;
  }

  private s3() {
    this.state = 3;
    this.clearRows();
    this.previousRow = this.highlightedRow;
    this.isAdding = true;
    return this.s4();
  }

  private s4() {
    this.state = 4;
    this.clearRows();
    this.previousRow = this.highlightedRow;
    this.toggleRows();
    if(this.c6()) {
      this.s0();
      return;
    }
  }

  private s5() {
    this.state = 5;
    this.highlightedRow = this.currentRow;
    this.previousRow = this.currentRow;
    this.isAdding = !this.selectedRows.get(this.currentRow, 0);
    return this.s6();
  }

  private s6() {
    this.state = 6;
    this.toggleRows();
  }

  private s7() {
    this.state = 7;
    this.clearRows();
    this.isAdding = true;
    this.highlightedRow = this.currentRow;
    this.previousRow = this.currentRow;
    return this.s8();
  }

  private s8() {
    this.state = 8;
    this.toggleRows();
  }

  private s9() {
    this.state = 9;
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
      } else if(operation instanceof RemoveRowOperation) {
        if(operation.index === this.highlightedRow) {
          this.highlightedRow = -1;
        }
        this.selectedRows.removeRow(operation.index);
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

  public state: number;
  private selectedRows: ArrayTableModel;
  private highlightedRow: number;
  private previousRow: number;
  private currentRow: number;
  private isShiftDownL: boolean;
  private isShiftDownR: boolean;
  private isCtrlDownL: boolean;
  private isCtrlDownR: boolean;
  private isCmdDownL: boolean;
  private isCmdDownR: boolean;
  private isMetaDownL: boolean;
  private isMetaDownR: boolean;
  private isMouseDown: boolean;
  private isUpDown: boolean;
  private isDownDown: boolean;
  private isAdding: boolean;
}
