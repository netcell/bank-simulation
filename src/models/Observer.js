import { useState } from "react";

export const getAvgOverTime = ({
  lastValue,
  lastAvg,
  lastTime,
  firstTime,
  thisTime = Date.now()
}) => {
  const lastDuration = lastTime - firstTime;
  const thisDuration = thisTime - lastTime;
  const totalDuration = thisTime - firstTime;
  return (lastValue * thisDuration + lastAvg * lastDuration) / totalDuration;
};

export const useStats = () => {
  const [stats, setStats] = useState({
    firstTime: Date.now(),
    lastTime: Date.now(),
    lastAvg: 0,
    lastValue: 0,
    lastDiff: 0,
    max: 0
  });

  const setStat = callback => {
    setStats(stats => {
      const value = callback(stats);
      const thisTime = Date.now();
      const thisAvg = getAvgOverTime({
        ...stats,
        thisTime
      });
      const max = Math.max(value, stats.max);
      return {
        ...stats,
        lastTime: thisTime,
        lastAvg: thisAvg,
        lastValue: value,
        lastDiff: Math.abs(thisAvg - max),
        max
      };
    });
  };

  return [stats, setStat];
};
