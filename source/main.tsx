import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';

const model = new ArrayTableModel();
for(let row = 0; row < 500; ++row) {
  const r = [];
  for(let column = 0; column < 3; ++column) {
    r.push(Math.floor(Math.random() * 1000000));
  }
  model.addRow(r);
}

const header = ['one', 'two', 'three'];

ReactDOM.render(<TableView model={model} header={header}/>,
  document.getElementById('main'));
