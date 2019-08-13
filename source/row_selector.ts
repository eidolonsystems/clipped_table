/** Specifies the members needed on a table class to resize its columns. */
export interface TableInterface {
}

/** Provides the functionality needed to resize a table's columns. */
export class ColumnResizer {

  /** Constructs a ColumnResizer.
   * @param table - The interface to the table being resized.
   */
  constructor(table: TableInterface) {
    this.isShiftDown = true;
    this.isCtrlDown  = true;
    this.isMouseDown = true;
    this.isUpDown = true;
    this.isDownDown  = true;
    this.s0();
  }

  /** Handles the cursor moving.
   * @param event - The event describing the mouse move.
   */
  public onMouseMove(event: PointerEvent) {

  }

  /** Handles pressing down a mouse button. */
  public onMouseDown(event: PointerEvent) {
    this.isMouseDown = true;
  }

  /** Handles releasing a mouse button. */
  public onMouseUp(event: PointerEvent) {
    this.isMouseDown = false;
  }

  public onKeyDown(keycode: number) {
    if(keycode === 38) { // arrow up
      this.isUpDown = true;
    } else if(keycode === 40) { // arrow down
     this.isDownDown = true;
    } else if(keycode === 16) { // shift
      this.isShiftDown = true;
    } else if(keycode === 17) {
      this.isCtrlDown = true;
    }
  }

  public onKeyUp(keycode: number) {
    if(keycode === 38) { // arrow up
      this.isUpDown = false;
    } else if(keycode === 40) { // arrow down
     this.isDownDown = false;
    } else if(keycode === 16) { // shift
      this.isShiftDown = false;
    } else if(keycode === 17) {
      this.isCtrlDown = false;
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
  }

  private s2() {
    this.state = 2;
    if(this.C4()) {
      this.s0();
    }
  }

  private s3() {
    this.state = 3;
  }

  private s4() {
    this.state = 4;
  }

  private s5() {
    this.state = 5;
  }

  private s6() {
    this.state = 6;
  }

  private s7() {
    this.state = 7;
  }

  private state: number;
  private isShiftDown: boolean;
  private isCtrlDown: boolean;
  private isMouseDown: boolean;
  private isUpDown: boolean;
  private isDownDown: boolean;
}
