import { useCallback, useEffect, useState } from 'react';
import { useSound } from './useSound';
import { useAnsweredList } from './useAnsweredList';

export const useKukuQuestion = () => {
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [a, setA] = useState([1, 0, 0]);
  const { play: correct } = useSound('/correct.mp3');
  const { play: incorrect } = useSound('/incorrect.mp3', 0.3);
  const { addAnsweredList } = useAnsweredList();

  const resetQuestion = useCallback(() => {
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
  }, []);

  const answer = useCallback((ans: number) => {
    const isCorrect = ans === q1 * q2;
    if (isCorrect) {
      correct();
    } else {
      incorrect();
    }
    addAnsweredList(`${q1} x ${q2} = ${q1 * q2}`, isCorrect);
    resetQuestion();
  }, [addAnsweredList, correct, incorrect, resetQuestion, q1, q2]);

  useEffect(() => {
    resetQuestion();
  }, [resetQuestion]);

  return {a1: a[0], a2: a[1], a3: a[2], q1, q2, answer};
};
