import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';

const model = new ArrayTableModel();
for(let row = 0; row < 100; ++row) {
  const r = [];
  for(let column = 0; column < 4; ++column) {
    if(column === 0) {
      r.push(row);
    } else if(column === 2 || column === 3) {
      r.push(Math.floor(Math.random() * 10));
    } else {
      r.push(Math.floor(Math.random() * 50));
    }
  }
  model.addRow(r);
}

const header = ['one', 'two', 'three', 'four'];

const someStyle = {
  table: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '20px',
    borderCollapse: 'collapse',
    border: '5px solid #000000'
  },
  th: {
    border: '2px solid #000000',
    color: '#4b23a0'
  },
  td: {
    border: '2px solid #000000',
    paddingLeft: '30px',
    paddingRight: '30px',
    color: '#4b23a0'
  }
};

function changeValues() {
  const rowsToChange = Math.floor(Math.random() * model.rowCount / 2);
  const coinFlip = Math.floor(Math.random() * 4);
  for(let i = 0; i < rowsToChange; ++i) {
    const someRow = Math.floor(Math.random() * model.rowCount);
    if(model.rowCount > 500) {
      model.removeRow(someRow);
    } else if(coinFlip < 3) {
      const someValue = Math.floor(Math.random() * model.rowCount) + 0.5;
      const someColumn = Math.floor(Math.random() * 5);
      model.set(someRow, someColumn, someValue);
    } else {
      const num = Math.floor(Math.random() * 90) + 100;
      model.addRow([model.rowCount, num, num, num], someRow);
    }
  }
}

setInterval(changeValues, 5000);

ReactDOM.render(
  <TableView model={model} labels={header} style={someStyle} activeWidth={10}/>,
  document.getElementById('main'));
