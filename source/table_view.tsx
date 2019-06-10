import * as React from 'react';
import { TableModel } from './table_model';
import {TableInterface } from './column_resizer';

interface Properties {

  /** The model to display. */
  model: TableModel;

  /**  The label for the columns of the table.*/
  labels?: string[]

  /** Specifies the CSS class. */
  className?: string;

  /** The CSS style to apply. */
  style?: any;
}

interface State {
  colWidth: number[];
}

/** Renders a TableModel to HTML. */
export class TableView extends React.Component<Properties, State> implements 
    TableInterface{
  public static readonly defaultProps = {
    header: [] as string[],
    style: {},
  };

  public constructor(props: Properties) {
    super(props);
    this.state = {
      colWidth: []
    }
    this._header_refs = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      this._header_refs[i] = null;
      this.state.colWidth[i] = 10;
    }
    this.onResize = this.onResize.bind(this);
    this.getColumnWidth = this.getColumnWidth.bind(this);
    console.log(this.state.colWidth);
  }

  public render(): JSX.Element {
    console.log('RENDER!');
    const header = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      header.push(
        <th style={{width: this.state.colWidth[i]}}
            className={this.props.className}
            ref={(label) => this._header_refs[i] = label}
            key={this.props.labels[i]}>
          {this.props.labels[i]}
        </th>);
    }
    const tableRows = [];
    for(let i = 0; i < this.props.model.rowCount; ++i) {
      const row = [];
      for(let j = 0; j < this.props.model.columnCount; ++j) {
        row.push(
          <td style={this.props.style.td}
              className={this.props.className}
              key={(i * this.props.model.columnCount) + j}>
            {this.props.model.get(i, j)}
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
      <table style={this.props.style.table}
          className={this.props.className}>
        <thead style={this.props.style.thead}
            className={this.props.className}
            ref={(header) => {this._header = header;}}>
          <tr style={this.props.style.tr}
              className={this.props.className}>
            {header}
          </tr>
        </thead>
        <tbody style={this.props.style.tbody}
            className={this.props.className}>
          {tableRows}
        </tbody>
      </table>);
  }

  public getInterface() {
    let newThing = {
      columnCount: this.columnCount,
      activeWidth: this.activeWidth,
      corners: this.corners,
      getColumnWidth: this.getColumnWidth,
      onResize: this.onResize
    } as TableInterface;
    return newThing;
  }

  public get columnCount() {
    return this.props.model.columnCount;
  }

  public get activeWidth() {
    return this._activeWidth;
  }

  public get corners() {
    console.log('reference', this._header);
    if(this._header) {
      const boundingClient = this._header.getBoundingClientRect();
      this._corners = {topLeft: {x:  boundingClient.left, y: boundingClient.top}, 
        bottomRight: {x: boundingClient.right,y: boundingClient.bottom}};
    } else {
      this._corners = {topLeft: {x:  0, y: 0}, 
        bottomRight: {x: 0, y: 0}};
    }
    return this._corners;
  }

  public getColumnWidth(index: number) {
    return this._header_refs[index].offsetWidth;
  }

public onResize(columnIndex: number, difference: number) {
    console.log('RESIZE!');
    console.log('difference!', difference);
    if(columnIndex >= this.props.model.columnCount) {
      throw RangeError();
    }
    if(difference === 0) {
      return;
    }
    const changedWidth = this.state.colWidth[columnIndex] + difference;
    if(changedWidth < this.minWidth) {
      this.state.colWidth[columnIndex] = this.minWidth;
    } else {
      this.state.colWidth[columnIndex] = changedWidth;
    }
    this._corners.bottomRight.x = 0;
    for(let i = 0; i < this.props.model.columnCount; ++i) {
      this._corners.bottomRight.x += this.state.colWidth[i];
    }
    this.setState({colWidth: this.state.colWidth});
    console.log(this.state.colWidth);
    console.log('WHY NO RERENDER');
  } 

  private  _activeWidth = 50;
  private  minWidth = 20;
  private _corners: {
    topLeft: {
      x: number
      y: number
    },
    bottomRight: {
      x: number
      y: number
    }
  };
  private _header_refs: HTMLHeadElement[];
  private _header: HTMLHeadElement;
}
