import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';
import { withRouter } from 'react-router';

const model = new ArrayTableModel();
for(let row = 0; row < 500; ++row) {
  const r = [];
  for(let column = 0; column < 3; ++column) {
    r.push(Math.floor(Math.random() * 1000000));
  }
  model.addRow(r);
}

const header = ['one', 'two', 'three'];

const someStyle = {
  table: {
    backgroundColor: '#4b23a0',
    fontColor: 'white',
    fontSize: '20px',
    borderCollapse: 'collapse'
  },
  td: {
    border: '1px solid #c1aaff' ,
    color: '#c1aaff',
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: '10px'
  },
  th: {
    color: 'white',
    fontFamily: 'Arial, Helvetica, sans-serif'
  }
};

ReactDOM.render(<TableView model={model} header={header} style={someStyle}/>,
  document.getElementById('main'));
