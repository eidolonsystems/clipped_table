import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';
import { withRouter } from 'react-router';

const model = new ArrayTableModel();
for(let row = 0; row < 500; ++row) {
  const r = [];
  for(let column = 0; column < 5; ++column) {
    r.push(Math.floor(Math.random() * 1000000));
  }
  model.addRow(r);
}

const header = ['one', 'two', 'three', 'four', 'five'];

const someStyle = {
  table: {
    fontSize: '20px',
    borderCollapse: 'collapse',
    boxSizing: 'border-box',
    border: '1px solid #4b23a0'
  },
  td: {
    border: '1px solid #4b23a0' ,
    color: '#4b23a0',
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: '10px'
  },
  th: {
    color: '#4b23a0',
    backgroundColor: '#d4cee0',
    fontFamily: 'Arial, Helvetica, sans-serif'
  }
};

ReactDOM.render(<TableView model={model} header={header} style={someStyle}/>,
  document.getElementById('main'));
