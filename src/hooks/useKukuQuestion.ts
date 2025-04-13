import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSound } from './useSound';
import { useAnsweredList } from './useAnsweredList';
import { useQuery } from './useQuery';

let questionNo = 0;
let lastQuestionNo = 0;
let remainingTime = 0;
let startDate = Date.now();
let lastAnswer = '';

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
  const [isOniTrainingMode, setIsOniTrainingMode] = useState(false);
  const [_isShowCorrect, setIsShowCorrect] = useState(false);
  const ___isShowCorrect = useRef(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const _updateTrainingTimer = useRef(() => {});
  const isShowCorrect = useMemo(() => ((isTrainingMode || isOniTrainingMode) && _isShowCorrect) || correctModeQuery === '1', [isTrainingMode, isOniTrainingMode, _isShowCorrect, correctModeQuery]);
  const trainingTime = useMemo(() => isOniTrainingMode ? 1500 : 3000, [isOniTrainingMode]);

  const resetQuestion = useCallback(({ isLastCorrect = false }: { isLastCorrect: boolean } = { isLastCorrect: false }) => {
    questionNo++;
    const isResetQuestion = !((isTrainingMode || isOniTrainingMode) && (!isLastCorrect || ___isShowCorrect.current));
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
  }, [q1, q2, isTrainingMode, isOniTrainingMode]);

  const updateTrainingTimer = useCallback(() => {
    if (!isTrainingMode && !isOniTrainingMode) {
      return;
    }
    if (progressRef.current == null) {
      return;
    }
    if (remainingTime >= 0) {
      remainingTime = trainingTime - (Date.now() - startDate);
      progressRef.current.style.width = `${(1 - remainingTime / trainingTime) * 100}dvw`;
      requestAnimationFrame(_updateTrainingTimer.current);
      return;
    }
    const currentAnswer = `${q1} x ${q2} = ${ans}`;
    if (lastAnswer === currentAnswer && lastQuestionNo === questionNo) {
      return;
    }
    lastQuestionNo = questionNo;
    lastAnswer = currentAnswer;

    incorrect();
    addAnsweredList(currentAnswer, false);
    setIsShowCorrect(true);
  }, [isTrainingMode, isOniTrainingMode, trainingTime, q1, q2, ans, questionNo]);
  _updateTrainingTimer.current = updateTrainingTimer;

  const resetTraining = useCallback(() => {
    remainingTime = isOniTrainingMode ? 1500 : 3000;
    startDate = Date.now();
    updateTrainingTimer();
  }, [isOniTrainingMode, updateTrainingTimer]);

  const answer = useCallback((ans: number) => {
    const isCorrect = ans === q1 * q2;
    if (isCorrect) {
      correct();
    } else {
      incorrect();
    }
    if (!isShowCorrect) {
      addAnsweredList(`${q1} x ${q2} = ${ans}`, isCorrect);
    }
    resetQuestion({ isLastCorrect: isCorrect });
    resetTraining();
  }, [addAnsweredList, correct, incorrect, resetQuestion, resetTraining, q1, q2, isShowCorrect]);

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
        setIsOniTrainingMode(false);
      } else {
        setIsShowCorrect(false);
      }
      return next;
    });
  }, []);

  const toggleOniTrainingMode = useCallback(() => {
    setIsOniTrainingMode((current) => {
      const next = !current;
      if (next) {
        setIsShowCorrect(true);
        setIsTrainingMode(false);
      } else {
        setIsShowCorrect(false);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    ___isShowCorrect.current = _isShowCorrect;
  }, [_isShowCorrect]);

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
    toggleOniTrainingMode,
    isOniTrainingMode,
    isShowCorrect,
    progressRef,
  };
};
