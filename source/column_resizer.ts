/** Specifies the members needed on a table class to resize its columns. */
export interface TableInterface {

  /** Returns the number of columns. */
  columnCount: number;

  /** Returns the width of the active region. */
  activeWidth: number;

  /** Returns the coordinates of the top left corner
   *  and bottom right corner.
   */
  corners: {
    topLeft: {
      x: number 
      y: number
    }, 
    bottomRight: {
      x: number 
      y: number
    }
  };

  /** Returns the width of a column.
   * @param index - The index of the column.
   * @return The width in pixels of the column at the specified index.
   */
  getColumnWidth: (index: number) => number;

  /** Resizes the column.
   * @param index - The index of the column.
   * @param difference The number of pixels to grow or increase the width by.
   */
  onResize: (columnIndex: number, difference: number) => void;
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
  }

  /** Handles the cursor moving.
   * @param event - The event describing the mouse move.
   */
  public onMouseMove(event: MouseEvent) {
    if(this.state === 2) {
      return this.s3(event);
    }
  }

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   */
  public onMouseDown(event: MouseEvent) {
    if(this.state === 0) {
      return this.s1(event);
    }
  }

  /** Handles releasing a mouse button.
   * @param event - The event describing the button release.
   */
  public onMouseUp(event: MouseEvent) {
    if(this.state === 2) {
      return this.s0();
    }
  }

  private s0() {
    this.state = 0;  
  }

  private s1(event: MouseEvent) {
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
  }

  private s3(event: MouseEvent) {
    this.state = 3;
    this.table.onResize(this.currentIndex, event.movementX);
    return this.s2();
  }

  private getLabel(point: {x: number, y: number}) {
    let label = -1;
    if(this.table.corners.topLeft.y <= point.y &&
        this.table.corners.bottomRight.y >= point.y &&
        this.table.corners.topLeft.x <= point.x &&
        this.table.corners.bottomRight.x >= point.x) {
      let edge = this.table.corners.topLeft.x;
      for(let i = 0; i < this.table.columnCount; ++i) {
        edge += this.table.getColumnWidth(i);
        const innerEdge = edge - this.table.activeWidth;
        if(innerEdge <= point.x && point.x <= edge ) {
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
