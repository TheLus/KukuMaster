import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSound } from './useSound';
import { useAnsweredList } from './useAnsweredList';
import { useQuery } from './useQuery';

let questionNo = 0;
let correctTimer: NodeJS.Timeout;

export const useKukuQuestion = () => {
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [a, setA] = useState([1, 0, 0]);
  const { play: correct } = useSound('/correct.mp3');
  const { play: incorrect } = useSound('/incorrect.mp3', 0.3);
  const { addAnsweredList, resetAnsweredList } = useAnsweredList();
  const { correctModeQuery } = useQuery('correctMode');
  const ans = useMemo(() => q1 * q2, [q1, q2]);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [_isShowCorrect, setIsShowCorrect] = useState(false);
  const isShowCorrect = useMemo(() => _isShowCorrect || correctModeQuery === '1', [_isShowCorrect, correctModeQuery]);

  const resetQuestion = useCallback(({ isLastCorrect = false }: { isLastCorrect: boolean } = { isLastCorrect: false }) => {
    questionNo++;
    const isResetQuestion = !(isTrainingMode && !isLastCorrect);
    const newQ1 = isResetQuestion ? Math.floor(Math.random() * 8) + 2 : q1;
    const newQ2 = isResetQuestion ? Math.floor(Math.random() * 8) + 2 : q2;
    const newA = [0, 0, 0];
    const correctNo = Math.floor(Math.random() * 3);
    newA[0] = newQ1 * newQ2 + newQ1 * (0 - correctNo);
    newA[1] = newQ1 * newQ2 + newQ1 * (1 - correctNo);
    newA[2] = newQ1 * newQ2 + newQ1 * (2 - correctNo);
    setQ1(newQ1);
    setQ2(newQ2);
    setA(newA);

    setIsShowCorrect(false);
    clearTimeout(correctTimer);
    correctTimer = setTimeout(() => {
      setIsShowCorrect(true);
    }, 1500);
  }, [q1, q2, isTrainingMode]);

  const answer = useCallback((ans: number) => {
    const isCorrect = ans === q1 * q2;
    if (isCorrect) {
      correct();
    } else {
      incorrect();
    }
    addAnsweredList(`${q1} x ${q2} = ${ans}`, isCorrect);
    resetQuestion({ isLastCorrect: isCorrect });
  }, [addAnsweredList, correct, incorrect, resetQuestion, q1, q2]);

  const reset = useCallback(() => {
    resetAnsweredList();
    resetQuestion();
  }, [resetAnsweredList]);

  useEffect(() => {
    resetQuestion();
  }, []);

  const toggleTrainingMode = useCallback(() => {
    setIsTrainingMode((current) => {
      const next = !current;
      if (next) {
        setIsShowCorrect(true);
      } else {
        clearTimeout(correctTimer);
        setIsShowCorrect(false);
      }
      return next;
    });
  }, []);

  return {
    a1: a[0],
    a2: a[1],
    a3: a[2],
    q1,
    q2,
    ans,
    answer,
    reset,
    questionNo,
    toggleTrainingMode,
    isTrainingMode,
    isShowCorrect,
  };
};
