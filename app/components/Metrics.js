import { useEffect, useState } from "react";

const Metrics = ({ startedAt, firstMessageAt, completedAt, completion }) => {
  const [timeSinceStart, setTimeSinceStart] = useState(null);
  const [timeToFirstToken, setTimeToFirstToken] = useState(null);
  const [tokensPerSecond, setTokensPerSecond] = useState(null);
  const [totalTime, setTotalTime] = useState(null);

  useEffect(() => {
    if (!startedAt) {
      return;
    }

    if (firstMessageAt) {
      const timeToFirst = (firstMessageAt - startedAt) / 1000;
      setTimeToFirstToken(timeToFirst.toFixed(2));
    }

    if (completedAt) {
      const totalTimeCalc = (completedAt - startedAt) / 1000;
      setTotalTime(totalTimeCalc.toFixed(2));

      if (completion) {
        // This is a very rough approximation
        const tokens = completion.length / 4;
        const tokensPerSecondCalc = tokens / totalTimeCalc;
        setTokensPerSecond(tokensPerSecondCalc.toFixed(2));
      }
    } else {
      const interval = setInterval(() => {
        const timeSinceStartCalc = (new Date() - startedAt) / 1000;
        setTimeSinceStart(timeSinceStartCalc.toFixed(2));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startedAt, firstMessageAt, completedAt, completion]);

  if (!startedAt) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-apple-text-tertiary mb-2 font-mono transition-colors duration-200">
      {timeToFirstToken && (
        <div className="flex items-center">
          <span className="mr-1 text-apple-accent-blue dark:text-apple-accent-blue/90">⏱</span>
          <span>First token: {timeToFirstToken}s</span>
        </div>
      )}
      {tokensPerSecond && (
        <div className="flex items-center">
          <span className="mr-1 text-apple-accent-green dark:text-apple-accent-green/90">⚡</span>
          <span>Speed: {tokensPerSecond} tokens/s</span>
        </div>
      )}
      {totalTime && (
        <div className="flex items-center">
          <span className="mr-1 text-apple-accent-purple dark:text-apple-accent-purple/90">⌛</span>
          <span>Total time: {totalTime}s</span>
        </div>
      )}
      {timeSinceStart && (
        <div className="flex items-center">
          <span className="mr-1 text-apple-accent-orange dark:text-apple-accent-orange/90">⏳</span>
          <span>Time elapsed: {timeSinceStart}s</span>
        </div>
      )}
    </div>
  );
};

export default Metrics;
