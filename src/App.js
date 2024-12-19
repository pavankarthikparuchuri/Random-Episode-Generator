import './App.css';
import React from 'react';
import RandomEpisodeGenerator from './RandomEpisodeGenerator';


function App() {
  return (
    <div  className="app-container">
      <header className="header">
      <h1 className="title">Random Episode Generator</h1>
    </header>
      <main>
         <RandomEpisodeGenerator />
      </main>
      <footer>
          Developed by Paruchuri Pavankarthik
      </footer>
    </div>
  );
}

export default App;
