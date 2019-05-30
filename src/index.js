import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { Simulator, useSimulator } from "./Simulator";

function App() {
  const simYellow = useSimulator("yellow", 100, 100, 1);
  const simRed = useSimulator("red", 100, 100, 1);
  const simBlue = useSimulator("blue", 100, 100, 1);

  const lastDiffs = [simYellow, simRed, simBlue].map(
    sim => sim.waitTimes.lastDiff
  );
  const minDiff = Math.min(...lastDiffs);

  return (
    <div>
      <div
        className="App"
        style={{
          display: "flex"
        }}
      >
        <Simulator {...simYellow} minDiff={minDiff} />
        <Simulator {...simRed} minDiff={minDiff} />
        <Simulator {...simBlue} minDiff={minDiff} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
