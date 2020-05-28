import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
// import './App.css';

const numRows = 50;
const numCols = 50;

// organize checking of Moore Neighborhood, 8 locations
const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [-1, 0],
];

// create empty grid
const generateEmptyGrid = () => {
  // const rows = [];
  // for (let i = 0; i < numRows; i++) {
  //   rows.push(Array.from(Array(numCols), () => 0));
  // }
  // return rows;

  // alternative syntax to build empty grid
  return Array(numRows).fill(Array(numCols).fill(0));
};

// create random grid
const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => Math.floor(Math.random() * 2)));
  }
  return rows;
};

// The Game!
function App() {
  // control grid state
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
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
    //simulate and update grid state for each life cycle
    setGrid((g) => {
      // use immer to handle mutating values in the grid
      // current grid = g
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              // adding numRows or numCols and then using % allows the edges to wrap/interact
              // to help simulate an infinite grid
              const newI = (i + x + numRows) % numRows;
              const newK = (k + y + numCols) % numCols;
              // if statement should be unnecessary with the modulo above
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });
            // Rules #1 under population and #3 over population
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    // rate of growth
    setTimeout(runSimulation, 400);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {" "}
        {running ? "stop" : "start"}{" "}
      </button>
      <button
        onClick={() => {
          setGrid(generateRandomGrid());
        }}
      >
        randomize
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows: [], i) =>
          rows.map((col: any, k) => (
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
