import * as React from 'react';
import { ColumnResizer, Rectangle, TableInterface } from './column_resizer';
import { ColumnOrder, SortedTableModel } from './sorted_table_model';
import { TableModel } from './table_model';

interface Properties {

  /** The model to display. */
  model: TableModel;

  /** The label for the columns of the table. */
  labels?: string[];

  /** Specifies the CSS class. */
  className?: string;

  /** The CSS style to apply. */
  style?: any;

  /** The width of active area measured from the right edge. */
  activeWidth?: number;
}

/** Renders a TableModel to HTML. */
export class TableView extends React.Component<Properties> implements
    TableInterface {
  public static readonly defaultProps = {
    header: [] as string[],
    style: {},
    activeWidth: 20
  };

  constructor(props: Properties) {
    super(props);
    this.headerRefs = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      this.headerRefs[i] = null;
    }
    this.table = new SortedTableModel(this.props.model);
    this.table.connect(this.forceUpdate.bind(this, null));
  }

  public componentDidMount() {
    this.columnResizer = new ColumnResizer(this);
    document.addEventListener('pointerdown',
      this.columnResizer.onMouseDown.bind(this.columnResizer));
    document.addEventListener('pointerup',
      this.columnResizer.onMouseUp.bind(this.columnResizer));
    document.addEventListener('pointermove',
      this.columnResizer.onMouseMove.bind(this.columnResizer));
  }

  public componentWillUnmount() {
    document.removeEventListener('pointerdown', this.columnResizer.onMouseDown);
    document.removeEventListener('pointerup', this.columnResizer.onMouseUp);
    document.removeEventListener('pointermove', this.columnResizer.onMouseMove);
  }

  public render(): JSX.Element {
    const header = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      header.push(
        <th style={this.props.style.th}
            className={this.props.className}
            ref={(label) => this.headerRefs[i] = label}
            onMouseDown={(e: React.MouseEvent<HTMLTableHeaderCellElement>) =>
              this.onClickHeader(e, i)}
            key={this.props.labels[i]}>
          {this.props.labels[i]}
        </th>);
    }
    const tableRows = [];
    for(let i = 0; i < this.table.rowCount; ++i) {
      const row = [];
      for(let j = 0; j < this.table.columnCount; ++j) {
        row.push(
          <td style={this.props.style.td}
              className={this.props.className}
              key={(i * this.table.columnCount) + j}>
            {this.table.get(i, j)}
          </td>);
      }
      tableRows.push(
        <tr style={this.props.style.tr}
            className={this.props.className}
            key={i}>
          {row}
        </tr>);
    }
    return(
      <div style={{overflowX: 'scroll'}}>
        <table style={this.props.style.table}
            className={this.props.className}>
          <thead style={this.props.style.thead}
              className={this.props.className}>
            <tr style={this.props.style.tr}
                ref={(row) => this.headerRowRef = row}
                className={this.props.className}>
              {header}
            </tr>
          </thead>
          <tbody style={this.props.style.tbody}
              className={this.props.className}>
            {tableRows}
          </tbody>
        </table>
      </div>);
  }

  public get columnCount(): number {
    return this.props.model.columnCount;
  }

  public get activeWidth(): number {
    return this.props.activeWidth;
  }

  public getColumnRect(index: number): Rectangle {
    const rectangle = this.headerRefs[index].getBoundingClientRect();
    return ({
      top: rectangle.top,
      left: rectangle.left,
      bottom: rectangle.bottom,
      right: rectangle.right
    } as Rectangle);
  }

  public onResize(columnIndex: number, width: number) {
    this.headerRefs[columnIndex].style.width = `${width}px`;
    this.headerRefs[columnIndex].style.minWidth = `${width}px`;
    this.headerRefs[columnIndex].style.maxWidth = `${width}px`;
  }

  public showResizeCursor() {
    this.headerRowRef.style.cursor = 'col-resize';
  }

  public restoreCursor() {
    this.headerRowRef.style.cursor = 'auto';
  }

  private onClickHeader(event: React.MouseEvent<HTMLTableHeaderCellElement>,
      index: number) {
    const rectangle = this.getColumnRect(index);
    const rightEdge = rectangle.right;
    const innerRightEdge = rightEdge - this.activeWidth;
    if(innerRightEdge <= event.clientX && event.clientX <= rightEdge) {
      return;
    }
    if(index > 0) {
      const previousRectangle = this.getColumnRect(index - 1);
      const leftEdge = previousRectangle.right;
      const innerLeftEdge = leftEdge + this.props.activeWidth;
      if(leftEdge <= event.clientX && event.clientX <= innerLeftEdge) {
        return;
      }
    }
    const order = this.table.columnOrder;
    if(order[0] && order[0].index === index) {
      order[0] = order[0].reverseSortOrder();
    } else if(order && -1 <
        order.findIndex((element) => element.index === index)) {
      const currentIndex =
        order.findIndex((element) => element.index === index);
      const curent = order.splice(currentIndex);
      order.unshift(order[0]);
    } else {
      order.unshift(new ColumnOrder(index));
    }
    this.table.columnOrder = order;
    this.forceUpdate();
  }

  private headerRefs: HTMLHeadElement[];
  private headerRowRef: HTMLTableRowElement;
  private columnResizer: ColumnResizer;
  private table: SortedTableModel;
}
