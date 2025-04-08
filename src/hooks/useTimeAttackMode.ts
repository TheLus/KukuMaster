import { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from './useSound';
import { useCountdownTimer } from './useCountdownTimer';

const TIME_ATTACK_TIME = 30000;

let countdownTimer: NodeJS.Timeout;
let resultCountTimer: NodeJS.Timeout;
let remainingTime = 0;
let startDate = Date.now();

type useTimeAttackModeProps = {
  questionNo: number;
  reset: () => void;
};

export const useTimeAttackMode = ({ questionNo, reset }: useTimeAttackModeProps) => {
  const [isTimeAttackMode, setIsTimeAttackMode] = useState(false);
  const { play: countdown } = useSound('/countdown.mp3', 0.2);
  const { play: dodon } = useSound('/dodon.mp3', 0.9);
  const { play: don } = useSound('/don.mp3');
  const [isTimeAttackFinished, setIsTimeAttackFinished] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const { beginCountdown, count } = useCountdownTimer();
  const [questionNoOffset, setQuestionNoOffset] = useState(0);
  const isTimeAttacking = useRef(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const toggleTimeAttackMode = useCallback(() => {
    setIsTimeAttackMode((current) => !current);
  }, []);

  const resultCountUp = useCallback(() => {
    don();
    setResultCount((current) => {
      if (current >= 2) {
        clearTimeout(resultCountTimer);
      }
      return current + 1
    });
  }, []);

  const updateTimeAttackTimer = useCallback(() => {
    if (!isTimeAttacking.current) {
      return;
    }
    if (remainingTime < 0 || progressRef.current == null) {
      dodon();
      setIsTimeAttackFinished(true);
      isTimeAttacking.current = false;
      resultCountTimer = setInterval(resultCountUp, 500);
      return;
    }
    remainingTime = TIME_ATTACK_TIME - (Date.now() - startDate);
    progressRef.current.style.width = `${(1 - remainingTime / TIME_ATTACK_TIME) * 100}dvw`;
    requestAnimationFrame(updateTimeAttackTimer);
  }, [resultCountUp]);

  const beginTimeAttack = useCallback(() => {
    remainingTime = TIME_ATTACK_TIME;
    startDate = Date.now();
    requestAnimationFrame(updateTimeAttackTimer);
    isTimeAttacking.current = true;
    setQuestionNoOffset(questionNo);
  }, [questionNo, updateTimeAttackTimer]);

  const resetTimeAttack = useCallback(() => {
    if (progressRef.current == null) {
      return;
    }
    isTimeAttacking.current = false;
    setIsTimeAttackFinished(false);
    setResultCount(0);
    remainingTime = 0;
    progressRef.current.style.width = `0dvw`;
    clearTimeout(countdownTimer);
    countdownTimer = setTimeout(() => {
      reset();
      countdown();
      beginCountdown(3);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isTimeAttackMode) {
      resetTimeAttack();
    } else {
      isTimeAttacking.current = false;
      clearTimeout(countdownTimer);
    }
  }, [isTimeAttackMode, resetTimeAttack]);

  useEffect(() => {
    if (count === 0 && isTimeAttackMode) {
      beginTimeAttack();
    }
  }, [count, isTimeAttackMode, beginTimeAttack]);

  return { isTimeAttackMode, isTimeAttackFinished, resultCount, count, questionNoOffset, isTimeAttacking, toggleTimeAttackMode, resetTimeAttack, progressRef }
};
