
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
   * @return The width in pixels of the column at the specified index.
   */
  getColumnRect: (index: number) => Rectangle;

  /** Resizes the column.
   * @param index - The index of the column.
   * @param width - The width of the column in pixels.
   */
  onResize: (columnIndex: number, width: number) => void;
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
  public onMouseMove(event: MouseEvent) {
    if(this.state === 2) {
      return this.s3(event);
    }
  }

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   */
  public onMouseDown(event: MouseEvent) {
    console.log('Mouse down!');
    console.log('state iz', this.state);
    console.log('x: ' ,event.clientX);
    if(this.state === 0) {
      return this.s1(event);
    }
    console.log('All done mouse down!');
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
    console.log('Getting label!');
    let label = -1;
    for(let i = 0; i < this.table.columnCount; ++i) {
      let rectangle = this.table.getColumnRect(i);
      let edge = rectangle.right;
      const innerEdge = edge - this.table.activeWidth;
      if(innerEdge <= point.x && point.x <= edge ) {
        label = i;
        break;
      }
    }
    this.currentIndex = label;
    return this.currentIndex;
  }

  private table: TableInterface;
  private state: number;
  private currentIndex: number;
}
