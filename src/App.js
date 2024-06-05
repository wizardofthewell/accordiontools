import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Transposer from "./Transposer";
import AccordionConverter from "./AccordionConverter";
import StandardConverter from "./StandardConverter";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Accordion Tools</h1>
        <ul>
          <li>
            <Link to="/Transposer">Standard Transposer + Convert</Link>
          </li>
          <li>
            <Link to="/AccordionConverter">Standard to Accordion</Link>
          </li>
          <li>
            <Link to="/StandardConverter">Accordion to Standard - Broken</Link>
          </li>
        </ul>

        <Routes>
          <Route path="/Transposer" element={<Transposer />} />
          <Route path="/AccordionConverter" element={<AccordionConverter />} />
          <Route path="/StandardConverter" element={<StandardConverter />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
