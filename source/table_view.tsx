import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TableModel } from './table_model';

interface Properties {

  /** The model to display. */
  model: TableModel;
}

/** Renders a TableModel to HTML. */
export class TableView extends React.Component<Properties> {
  public render(): JSX.Element {
    return <div/>;
  }
}
