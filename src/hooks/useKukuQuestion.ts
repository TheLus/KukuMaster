import { useCallback, useState } from 'react';
import { useSound } from './useSound';

export const useKukuQuestion = () => {
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [a, setA] = useState([1, 0, 0]);
  const { play: correct } = useSound('/correct.mp3');
  const { play: incorrect } = useSound('/incorrect.mp3', 0.3);

  const answer = useCallback((ans: number) => {
    if (ans === q1 * q2) {
      correct();
    } else {
      incorrect();
    }

    const newQ1 = Math.floor(Math.random() * 8) + 2;
    const newQ2 = Math.floor(Math.random() * 8) + 2;
    const newA = [0, 0, 0];
    const correctNo = Math.floor(Math.random() * 3);
    newA[0] = newQ1 * newQ2 + newQ1 * (0 - correctNo);
    newA[1] = newQ1 * newQ2 + newQ1 * (1 - correctNo);
    newA[2] = newQ1 * newQ2 + newQ1 * (2 - correctNo);
    setQ1(newQ1);
    setQ2(newQ2);
    setA(newA);
  }, [correct, incorrect, q1, q2]);

  return {a1: a[0], a2: a[1], a3: a[2], q1, q2, answer};
};
