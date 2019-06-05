/** Specifies the members needed on a table class to resize its columns. */
export interface TableInterface {

  /** Returns the number of columns. */
  columnCount: number;

  /** Returns the width of the mouse hover zone. */
  activeWidth: number;

  /** Returns the coordiinates of the top left corner 
   * and bottom right corner. 
   */
  corners: 
    {topLeft: {x: number, y: number}, bottomLeft: {x: number, y: number}};

  /** Returns the width of a column.
   * @param index - The index of the column.
   * @return The width in pixels of the column at the specified index.
   */
  getColumnWidth: (index: number) => number;
}

/** Provides the functionality needed to resize a table's columns. */
export class ColumnResizer {

  /** Constructs a ColumnResizer.
   * @param table - The interface to the table being resized.
   * @param onResize - Indicates a change to a column's width.
   */
  constructor(
      table: TableInterface, 
      onResize: (columnIndex: number, difference: number) => void) {
    this.s0();
    this.table = table;
    this.currentLabel = -1;
    this.resize = onResize;
  }

  /** Handles moving the mouse over the table's header region.
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
      return this.s2(event);
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
      this.s2(event);
    } else {
      this.s0();
    }
  }

  private s2(event: MouseEvent) {
    this.state = 2;
  }

  private s3(event: MouseEvent) {
    this.state = 3;
    const movement = event.movementX;
    this.resize(this.currentLabel, movement);
    this.s3(event);
  }


  private getLabel(point: {x: number, y: number}) {
    let label = -1;
    if(this.table.corners.topLeft.y <= point.y
        && this.table.corners.bottomLeft.y >= point.y
        && this.table.corners.topLeft.x <= point.x
        && this.table.corners.bottomLeft.x  >= point.x) {
      let i = 0;
      let edge = this.table.corners.topLeft.x + this.table.getColumnWidth(i);
      while(point.x <= edge) {
        const innerEdge = edge - this.table.activeWidth;
        if(innerEdge <= point.x) {
          label = i;
        } else {
          ++i;
          edge = edge + this.table.getColumnWidth(i);
        }
      }
      this.currentLabel = label;
      return this.currentLabel;
    } else {
      this.currentLabel = -1;
      return this.currentLabel;
    }
  }

  private table: TableInterface;
  private resize: (columnIndex: number, difference: number) => void;
  private state: number;
  private currentLabel: number;
}
