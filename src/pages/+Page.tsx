import { AnswerButton } from '@/components/AnswerButton';
import { AnsweredList } from '@/components/AnsweredList';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useAnsweredList } from '@/hooks/useAnsweredList';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { useKukuQuestion } from '@/hooks/useKukuQuestion';
import { useKukuTitle } from '@/hooks/useKukuTitle';
import { useSound } from '@/hooks/useSound';
import { useTimeAttackMode } from '@/hooks/useTimeAttackMode';
import { Box, Button, Grid, SxProps, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

export { Page };

let countdownTimer: NodeJS.Timeout;
let resultCountTimer: NodeJS.Timeout;
let remainingTime = 0;
let startDate = Date.now();

const TIME_ATTACK_TIME = 3000;

function Page() {
  const { a1, a2, a3, q1, q2, questionNo, answer, reset, isCorrectMode } = useKukuQuestion();
  const { correctRatio } = useAnsweredList();
  const { toggleTimeAttackMode, isTimeAttackMode } = useTimeAttackMode();
  const { beginCountdown, count } = useCountdownTimer();
  const [questionNoOffset, setQuestionNoOffset] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const isTimeAttacking = useRef(false);
  const [isTimeAttackFinished, setIsTimeAttackFinished] = useState(false);
  const { getKukuTitle } = useKukuTitle();
  const { play: countdown } = useSound('/countdown.mp3', 0.2);
  const { play: dodon } = useSound('/dodon.mp3', 0.9);
  const { play: don } = useSound('/don.mp3');
  const [resultCount, setResultCount] = useState(0);

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

  return (
    <Grid container direction='column' sx={sx}>
      <Grid container position='absolute' left={10} top={10} width={90} zIndex={1}>
        <Button onClick={toggleTimeAttackMode} variant={isTimeAttackMode ? 'contained' : 'outlined'} >タイム<br/>アタック</Button>
      </Grid>
      <Grid container className='TopPage' justifyContent='center'>
        <Grid container className='Scroller' justifyContent='center' style={{ transform: isTimeAttackMode ? 'translateY(-100dvh)' : 'none' }}>
          <Grid container justifyContent='center' width='100%'>
            <Grid container direction='column' maxWidth={700} alignItems='center' position='absolute' bottom={300}>
              <AnsweredList />
            </Grid>
            <Grid container direction='column' maxWidth={700} alignItems='center' gap={3} position='absolute' bottom={60}>
              <Grid container alignItems='center' gap={2}>
                <Typography variant='h1'>{q1}</Typography>
                <Typography variant='h2'>x</Typography>
                <Typography variant='h1'>{q2}</Typography>
              </Grid>
              <Grid container gap={3}>
                <AnswerButton answer={a1} onClick={answer} key={`${questionNo}_${a1}_1`} isCorrect={isCorrectMode && q1 * q2 === a1} />
                <AnswerButton answer={a2} onClick={answer} key={`${questionNo}_${a2}_2`} isCorrect={isCorrectMode && q1 * q2 === a2} />
                <AnswerButton answer={a3} onClick={answer} key={`${questionNo}_${a3}_3`} isCorrect={isCorrectMode && q1 * q2 === a3} />
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' position='absolute' top='100dvh' width='100%' height='100dvh'>
            <CountdownTimer count={count} sx={{ position: 'absolute', top: '40dvh', fontSize: 200, transition: 'opacity 0.2s ease', opacity: count > 0 ? 1 : 0 }} />
            <Grid container direction='column' maxWidth={700} alignItems='center' position='absolute' bottom={300} display={isTimeAttacking.current ? 'flex' : 'none'}>
              <AnsweredList />
            </Grid>
            <Grid container direction='column' maxWidth={700} alignItems='center' gap={3} position='absolute' bottom={60} display={isTimeAttacking.current ? 'flex' : 'none'}>
              <Grid container alignItems='center' gap={2}>
                <Typography variant='h1'>{q1}</Typography>
                <Typography variant='h2'>x</Typography>
                <Typography variant='h1'>{q2}</Typography>
              </Grid>
              <Grid container gap={3}>
                <AnswerButton answer={a1} onClick={answer} key={`${questionNo}_${a1}_1`} isCorrect={isCorrectMode && q1 * q2 === a1} />
                <AnswerButton answer={a2} onClick={answer} key={`${questionNo}_${a2}_2`} isCorrect={isCorrectMode && q1 * q2 === a2} />
                <AnswerButton answer={a3} onClick={answer} key={`${questionNo}_${a3}_3`} isCorrect={isCorrectMode && q1 * q2 === a3} />
              </Grid>
            </Grid>
            <Box position='absolute' width='100dvw' height='10px' bottom={0} sx={{ backgroundColor : '#cdf' }}>
              <Box ref={progressRef} position='absolute' height='10px' top={0} left={0} sx={{ backgroundColor : '#56f' }} />
            </Box>
            <Grid container direction='column' top={100} width='100%' position='absolute' gap={3} alignItems='center' display={isTimeAttackFinished ? 'flex' : 'none'}>
              <Grid container alignItems='center' width='100%' height='calc(100dvh - 555px)' mb={-24} justifyContent='center'>
                <AnsweredList wrap />
              </Grid>
              <Grid container gap={3} alignItems='baseline' display={resultCount > 0 ? 'flex' : 'none'}>
                <Typography variant='h1' fontSize={48}>回答数</Typography>
                <Typography variant='h1' fontSize={80} width={130} textAlign='right'>{questionNo - questionNoOffset}</Typography>
                <Typography variant='h1' fontSize={48}>問</Typography>
              </Grid>
              <Grid container gap={3} alignItems='baseline' display={resultCount > 1 ? 'flex' : 'none'}>
                <Typography variant='h1' fontSize={48}>正解率</Typography>
                <Typography variant='h1' fontSize={80} width={130} textAlign='right'>{ Math.floor(correctRatio * 100) }</Typography>
                <Typography variant='h1' fontSize={48}>%</Typography>
              </Grid>
              <Grid container height={77} alignItems='flex-end' display={resultCount > 2 ? 'flex' : 'none'}>
                <Typography variant='h1' fontSize={48} fontWeight='bold' height='93' whiteSpace='pre-wrap' textAlign='center'>{getKukuTitle(questionNo - questionNoOffset, correctRatio)}</Typography>
              </Grid>
              <Grid container bottom={170} mt={2} display={resultCount > 2 ? 'flex' : 'none'}>
                <Button onClick={resetTimeAttack} variant={isTimeAttackMode ? 'contained' : 'outlined'} >もう一回！</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

const sx: SxProps = () => ({
  ".TopPage": {
    position: 'relative',
    height: '100dvh',
    overflow: 'hidden',
  },

  ".Scroller": {
    position: 'relative',
    width: '100dvw',
    transition: 'transform 0.4s ease',
  },
});
