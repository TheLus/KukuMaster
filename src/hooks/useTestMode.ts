import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTimeAttackMode } from './useTimeAttackMode';
import { useAnsweredList } from './useAnsweredList';
import { useCompletedTests } from './useCompletedTests';
type useTestModeProps = {
  questionNo: number;
  reset: (args?: { table: number }) => void;
};

export const useTestMode = ({ questionNo, reset: _reset }: useTestModeProps) => {
  const table = useRef(-1);
  const [time, setTime] = useState(30000);
  const [passing, setPassing] = useState(0);
  const [level, setLevel] = useState(0);
  const reset = useCallback(() => {
    _reset({ table: table.current });
  }, [_reset]);
  const onFinish = useCallback(() => {
  }, []);
  const { isTimeAttackFinished: isTestFinished, isTimeAttackMode: isTestMode, setIsTimeAttackMode: setIsTestMode, isTimeAttacking: isTesting, count, progressRef, finishTimeAttack, resetTimeAttack } = useTimeAttackMode({ questionNo, reset, time, onFinish });
  const { answeredList, resetAnsweredList } = useAnsweredList();
  const { completeTest } = useCompletedTests();

  const resetTest = useCallback(() => {
    resetAnsweredList();
    resetTimeAttack();
  }, [resetTimeAttack, resetAnsweredList]);

  const passingCount = useMemo(() => {
    const correctCount = answeredList.filter(({ isCorrect }) => isCorrect).length;
    const incorrectCount = answeredList.filter(({ isCorrect }) => !isCorrect).length;
    return Math.max(correctCount - incorrectCount, 0);
  }, [answeredList]);

  const beginTest = useCallback(({ table: _table, time, passing, level }: { table: number, time: number, passing: number, level: number }) => {
    setIsTestMode(true);
    table.current = _table;
    reset();
    setTime(time);
    setPassing(passing);
    setLevel(level);
  }, []);

  useEffect(() => {
    if (isTestMode && passingCount >= passing && isTesting.current) {
      finishTimeAttack();
      completeTest(level, table.current);
    }
  }, [isTestMode, finishTimeAttack, passingCount, passing, level, completeTest]);

  return { beginTest, isTestMode, count, isTesting, progressRef, passingCount, passing, isTestFinished, resetTest, setIsTestMode }
};
