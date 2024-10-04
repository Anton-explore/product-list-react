import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProductTable from './components/ProductTable/ProductTable';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <ProductTable />
      </div>
    </Provider>
  );
};

export default App;
