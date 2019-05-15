import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';

const model = new ArrayTableModel();
for(let row = 0; row < 100000; ++row) {
  const r = [];
  for(let column = 0; column < model.columnCount; ++column) {
    r.push(Math.floor(Math.random() * 1000000));
  }
  model.addRow(r);
}

ReactDOM.render(<TableView model={model}/>,
  document.getElementById('main'));
