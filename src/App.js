import React from 'react';
import TaxCalculator from './components/TaxCalculator';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App bg-dark text-light min-vh-100">
      <div className="container py-5">
        <TaxCalculator />
      </div>
    </div>
  );
}

export default App;
