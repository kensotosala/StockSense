import { useEffect } from "react";
import "./App.css";

const App = () => {
  useEffect(() => {
    console.log("App montada");
  }, []);

  return (
    <main className="app">
      <header className="header">
        <h1 className="app-title">StockSense</h1>
        <p className="app-subtitle">Inventory Intelligence Platform</p>
      </header>

      <button className="btn-get-started">Get Started</button>
    </main>
  );
};

export default App;
