import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
// import './App.css';

const numRows = 50;
const numCols = 50;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  // keep track of whether or not simulation is running
  const [running, setRunning] = useState(false);

  // store ref for keeping value in simulation correct
  const runningRef = useRef(running);
  runningRef.current = running;

  // run the simulation once when component loads
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    //simulate
    setTimeout(runSimulation, 1000);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
        }}
      >
        {" "}
        {running ? "stop" : "start"}{" "}
      </button>
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
