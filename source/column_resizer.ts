
export interface Rectangle {
  x: number,
  y: number,
  width: number,
  height: number,
  top: number,
  left: number,
  bottom: number,
  right: number
}

/** Specifies the members needed on a table class to resize its columns. */
export interface TableInterface {

  /** Returns the number of columns. */
  columnCount: number;

  /** Returns the width of the active region. */
  activeWidth: number;

  /** Returns the width of a column.
   * @param index - The index of the column.
   * @return The rectange denoting all the corners of the element.
   */
  getColumnRect: (index: number) => Rectangle;

  /** Resizes the column.
   * @param index - The index of the column.
   * @param width - The width of the column in pixels.
   */
  onResize: (columnIndex: number, width: number) => void;

  /** Show the cursor. */
  showCursor:() => void;

  /** Hide the cursor. */
  hideCursor: () => void;
}

/** Provides the functionality needed to resize a table's columns. */
export class ColumnResizer {

  /** Constructs a ColumnResizer.
   * @param table - The interface to the table being resized.
   */

  constructor(table: TableInterface) {
    this.table = table;
    this.currentIndex = -1;
    this.s0();
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  /** Handles the cursor moving.
   * @param event - The event describing the mouse move.
   */
  public onMouseMove(event: PointerEvent) {
    if(this.state === 0) {
      return this.s1(event);
    } else if (this.state === 2) {
      return this.s1(event);
    } else if (this.state === 3) {
      return this.s4(event);
    }
  }

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   */
  public onMouseDown(event: PointerEvent) {
    if(this.state === 2) {
      return this.s3();
    }
  }

  /** Handles releasing a mouse button.
   * @param event - The event describing the button release.
   */
  public onMouseUp(event: PointerEvent) {
    if(this.state === 3) {
      return this.s0();
    }
  }

  private s0() {
    this.state = 0;
    this.table.hideCursor();
  }

  private s1(event: PointerEvent) { 
    this.state = 1;
    const currentCoor = {x: event.clientX, y: event.clientY};
    if(this.getLabel(currentCoor) > -1) {
      return this.s2();
    } else {
      return this.s0();
    }
  }

  private s2() {
    this.state = 2;
    this.table.showCursor();
  }

   private s3() {
    this.state = 3;
  }

  private s4(event: PointerEvent) {
    this.state = 4;
    if(event.clientX < this.table.getColumnRect(this.currentIndex).x) {
      return this.s3();
    }
    this.table.onResize(
      this.currentIndex, 
      Math.abs(event.clientX - this.table.getColumnRect(this.currentIndex).left));
    return this.s3();
  }

  private getLabel(point: {x: number, y: number}) {
    let label = -1;
    for(let i = 0; i < this.table.columnCount; ++i) {
      const leftRectangle = this.table.getColumnRect(i);
      const rightEdge = leftRectangle.right;
      const innerRightEdge = rightEdge - this.table.activeWidth;
      if(innerRightEdge <= point.x && point.x <= rightEdge ) {
        label = i;
        break;
      }
      if(i < this.table.columnCount-1) {
        const innerLeftEdge = rightEdge + this.table.activeWidth;
        if(rightEdge <= point.x && point.x <= innerLeftEdge ) {
          label = i;
          break;
        }
      }
    }
    this.currentIndex = label;
    return this.currentIndex;
  }

  private table: TableInterface;
  private state: number;
  private currentIndex: number;
}
