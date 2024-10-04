import React from 'react';
import './Loader.css';

const Loader: React.FC = () => {

  return (
    <div className="container">
      <div className="ring"></div>
      <div className="ring"></div>
      <div className="ring"></div>
      <p>Loading...</p>
    </div>
  );
}

export default Loader;