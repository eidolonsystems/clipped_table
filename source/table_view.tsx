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

  /** The height in pixels. */
  height: number;
}

interface State {
  fullScrollHeight: number;
  rowHeight: number;
  rowsToShow: number;
  topMostRow: number;
}

/** Renders a TableModel to HTML. */
export class TableView extends React.Component<Properties, State> implements
    TableInterface {
  public static readonly defaultProps = {
    header: [] as string[],
    style: {},
    activeWidth: 20
  };

  constructor(props: Properties) {
    super(props);
    this.state = {
      fullScrollHeight: 0,
      rowHeight: 0,
      rowsToShow: this.props.model.rowCount,
      topMostRow: 0
    };
    this.headerRefs = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      this.headerRefs[i] = null;
    }
    this.table = new SortedTableModel(this.props.model);
    this.table.connect(this.forceUpdate.bind(this, null));
    this.onScrollHandler = this.onScrollHandler.bind(this);
  }

  public componentDidMount() {
    this.columnResizer = new ColumnResizer(this);
    document.addEventListener('pointerdown',
      this.columnResizer.onMouseDown.bind(this.columnResizer));
    document.addEventListener('pointerup',
      this.columnResizer.onMouseUp.bind(this.columnResizer));
    document.addEventListener('pointermove',
      this.columnResizer.onMouseMove.bind(this.columnResizer));
    this.setState({});
    this.containerRef.addEventListener('scroll', this.onScrollHandler);
  }

  public componentDidUpdate() {
    if(this.firstRowRef !== null) {
      if(this.firstRowRef.offsetHeight !== this.state.rowHeight) {
        console.log('heights', this.firstRowRef.offsetHeight, this.firstRowRef.scrollHeight, this.firstRowRef.clientHeight);
        this.setState({
          rowHeight: this.firstRowRef.offsetHeight,
          fullScrollHeight:
            this.props.model.rowCount * this.firstRowRef.scrollHeight
        });

      }
    }
    if(this.firstRowRef !== null && this.firstRowRef !== undefined &&
        this.state.rowsToShow !==
         Math.floor(this.props.height / this.state.rowHeight)) {
      if(Math.floor(this.props.height / this.state.rowHeight) !== Infinity) {
        this.setState({
          rowsToShow: Math.floor(this.props.height / this.state.rowHeight
        )});
      }
    }
  }
  public componentWillUnmount() {
    document.removeEventListener('pointerdown', this.columnResizer.onMouseDown);
    document.removeEventListener('pointerup', this.columnResizer.onMouseUp);
    document.removeEventListener('pointermove', this.columnResizer.onMouseMove);
    document.removeEventListener('scroll', this.onScrollHandler);
  }

  public render(): JSX.Element {
    console.log('height', this.state.rowHeight);
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
    if(this.state.topMostRow !== 0) {
      tableRows.push(
        <tr style=
          {{...this.props.style.td,
            ...{height: `${this.state.topMostRow  * this.state.rowHeight}px`}}}
            className={this.props.className}
            key={'topFiller'}/>);
      }
    for(let i = this.state.topMostRow; i < this.state.topMostRow + this.state.rowsToShow; ++i) {
      const row = [];
      for(let j = 0; j < this.table.columnCount; ++j) {
        row.push(
          <td style={this.props.style.td}
              className={this.props.className}
              key={(i * this.table.columnCount) + j}>
            {this.table.get(i, j)}
          </td>);
      }
      if(i === 0 ) {
        tableRows.push(
          <tr style={this.props.style.tr}
              ref={(first) => this.firstRowRef = first}
              className={this.props.className}
              key={i}>
            {row}
          </tr>);
      } else {
        tableRows.push(
          <tr style={this.props.style.tr}
              className={this.props.className}
              key={i}>
            {row}
          </tr>);
      }
    }
    if(this.state.rowHeight !== 0) {
      tableRows.push(
        <tr style=
          {{...this.props.style.td,
            ...{height: `${(this.table.rowCount - this.state.rowsToShow - this.state.topMostRow)
            * this.state.rowHeight}px`}}}
            className={this.props.className}
            key={'bottomFiller'}/>);
      }
    return(
      <div style={{height: `${this.props.height}px`, overflow: 'auto'}}
        ref={(tbody) => this.containerRef = tbody}>
      <table style={{...this.props.style.table}}
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
    const foundIndex = order.findIndex((element) => element.index === index);
    if(foundIndex === 0) {
      order[0] = order[0].reverseSortOrder();
    } else if(foundIndex > 0) {
      const current = order.splice(foundIndex);
      order.unshift(current[0]);
    } else {
      order.unshift(new ColumnOrder(index));
    }
    this.table.columnOrder = order;
    this.forceUpdate();
  }

  private onScrollHandler() {
    const percent =
      this.containerRef.scrollTop / this.containerRef.scrollHeight;
    this.setState({topMostRow: Math.floor(percent * this.props.model.rowCount)});
    console.log('first row', Math.floor(percent * this.props.model.rowCount));
  }

  private headerRefs: HTMLHeadElement[];
  private headerRowRef: HTMLTableRowElement;
  private containerRef: HTMLDivElement;
  private firstRowRef: HTMLTableRowElement;
  private columnResizer: ColumnResizer;
  private table: SortedTableModel;
}
