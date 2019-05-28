import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TableModel } from './table_model';

interface Properties {

  /** The model to display. */
  model: TableModel;

  /**  */
  header: Array<string>

  /** Specifies the CSS class of the BoxLayout HTML element. */
  className?: string;

  /** The CSS style to apply. */
  style?: any;

}

/** Renders a TableModel to HTML. */
export class TableView extends React.Component<Properties> {
  public render(): JSX.Element {
    const header = [];
    for(let i = 0; i < this.props.header.length; ++i) {
      header.push(<th>{this.props.header[i]}</th>);
    }
    const tableRows = [];
    for(let i = 0; i < this.props.model.rowCount; ++i) {
      const row = [];
      for(let j = 0; j < this.props.model.columnCount; ++j) {
        row.push(
          <td key={(i * this.props.model.columnCount) + j}>
            {this.props.model.get(i, j)}
          </td>);
      }
      tableRows.push(<tr key={i}>{row}</tr>);
    }
    return(
      <table style={this.props.style.table} className={this.props.className}>
        <thead>
          <tr>
            {header}
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>);
  }
}
