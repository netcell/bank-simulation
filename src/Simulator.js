import React, { useEffect, useState } from "react";
import { useBank, useObserver } from "./useBank";

export const useSimulator = (type, P, ALPHA, timeScale = 1) => {
  const [customerCreator, teller] = useBank(type, P, ALPHA, timeScale);
  const [queueLengths, waitTimes, setTargets, logs, tellerLogs] = useObserver(
    timeScale
  );

  useEffect(() => {
    return setTargets(customerCreator, teller);
  }, [customerCreator, teller, setTargets, logs]);

  useEffect(() => {
    customerCreator.start();
    return customerCreator.stop;
  }, [customerCreator]);

  return {
    type,
    queueLengths,
    waitTimes,
    logs,
    tellerLogs
  };
};

export const Simulator = ({
  type,
  queueLengths,
  waitTimes,
  minDiff,
  logs,
  tellerLogs
}) => {
  return (
    <div
      className="Simulator"
      style={{
        flex: 1,
        textAlign: "left"
      }}
    >
      <h1>{type}</h1>
      <h3>Queue Length</h3>
      <p>Max: {queueLengths.max}</p>
      <p>Avg: {queueLengths.lastAvg.toFixed(2)}</p>
      <h3>Wait Time</h3>
      <p>Max: {(waitTimes.max / 1000).toFixed(2)}s</p>
      <p>Avg: {(waitTimes.lastAvg / 1000).toFixed(2)}s</p>
      <p
        style={{
          color: minDiff == waitTimes.lastDiff ? "red" : "black"
        }}
      >
        Diff: {(waitTimes.lastDiff / 1000).toFixed(2)}s
      </p>
      <h3>Current State</h3>
      <p>Queue Length: {queueLengths.lastValue}</p>
      <div
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px solid"
        }}
      >
        {logs.map(log => (
          <p>{log}</p>
        ))}
      </div>
      <div
        style={{
          height: "100px",
          overflowY: "scroll",
          border: "1px solid"
        }}
      >
        {tellerLogs.map(log => (
          <p>{log}</p>
        ))}
      </div>
    </div>
  );
};
