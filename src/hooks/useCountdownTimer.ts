import { useCallback, useEffect, useRef, useState } from 'react';


export const useCountdownTimer = () => {
  const [count, setCount] = useState(-1);
  const timerId = useRef<NodeJS.Timeout>(undefined);

  const beginCountdown = useCallback((count: number) => {
    clearTimeout(timerId.current);
    setCount(count);
  }, []);

  const clearCountdown = useCallback(() => {
    clearTimeout(timerId.current);
    setCount(-1);
  }, []);

  useEffect(() => {
    if (count <= -1) {
      return;
    }
    timerId.current = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
  }, [count]);

  return { count, beginCountdown, clearCountdown }
};
