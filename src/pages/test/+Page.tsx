import { AnswerButton } from '@/components/AnswerButton';
import { AnsweredList } from '@/components/AnsweredList';
import { CountdownTimer } from '@/components/CountdownTimer';
import { TestButton } from '@/components/TestButton';
import { useAnsweredList } from '@/hooks/useAnsweredList';
import { useCompletedTests } from '@/hooks/useCompletedTests';
import { useKukuQuestion } from '@/hooks/useKukuQuestion';
import { useKukuTitle } from '@/hooks/useKukuTitle';
import { useTestMode } from '@/hooks/useTestMode';
import { useTimeAttackMode } from '@/hooks/useTimeAttackMode';
import { CircleOutlined } from '@mui/icons-material';
import { Circle } from '@mui/icons-material';
import { Box, Button, Grid, Link, SxProps, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';

export { Page };

function Page() {
  const { a1, a2, a3, q1, q2, questionNo, answer, reset } = useKukuQuestion();
  const { beginTest, isTestMode, count, isTesting, progressRef, passingCount, passing, isTestFinished, resetTest, setIsTestMode } = useTestMode({ questionNo, reset });
  const isPassed = useMemo(() => passingCount >= passing, [passingCount, passing]);
  const { getIsComplete } = useCompletedTests();

  const finishTest = useCallback(() => {
    setIsTestMode(false);
  }, [setIsTestMode]);

  const isMastered = useCallback(() => {
    return getIsComplete(4, 4) && getIsComplete(4, 5) && getIsComplete(4, 6) && getIsComplete(4, 7) && getIsComplete(4, 8) && getIsComplete(4, 9);
  }, [getIsComplete]);

  const isDragon = useCallback(() => {
    return getIsComplete(5, 4) && getIsComplete(5, 5) && getIsComplete(5, 6) && getIsComplete(5, 7) && getIsComplete(5, 8) && getIsComplete(5, 9);
  }, [getIsComplete]);

  const isGod = useCallback(() => {
    return getIsComplete(6, 4) && getIsComplete(6, 5) && getIsComplete(6, 6) && getIsComplete(6, 7) && getIsComplete(6, 8) && getIsComplete(6, 9);
  }, [getIsComplete]);

  const isKuku = useCallback(() => {
    return getIsComplete(7, 4) && getIsComplete(7, 5) && getIsComplete(7, 6) && getIsComplete(7, 7) && getIsComplete(7, 8) && getIsComplete(7, 9);
  }, [getIsComplete]);

  return (
    <Grid container direction='column' sx={sx}>
      <Grid container position='absolute' right={10} top={10} width={90} zIndex={1} gap={0.5}>
        <Button variant='contained' sx={{ width: 90, height: 28 }} component={Link} href={import.meta.env.BASE_URL}>試練</Button>
      </Grid>
      <Grid container className='TopPage' justifyContent='center'>
        <Grid container className='Scroller' justifyContent='center' style={{ transform: isTestMode ? 'translateY(-100dvh)' : 'none' }}>
          <Grid container direction='column' alignItems='center' width='100%' gap={4} pt={8} sx={{ overflowY: 'scroll', height: '100dvh' }} wrap='nowrap' pb={4}>
            <Grid container direction='column' alignItems='center' gap={2}>
              <Typography variant='h5'>九九みならいの試練</Typography>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={1} table={4} time={30000} passing={5}>4 のだん</TestButton>
                <TestButton onClick={beginTest} level={1} table={5} time={30000} passing={5}>5 のだん</TestButton>
                <TestButton onClick={beginTest} level={1} table={6} time={30000} passing={5}>6 のだん</TestButton>
              </Grid>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={1} table={7} time={30000} passing={5}>7 のだん</TestButton>
                <TestButton onClick={beginTest} level={1} table={8} time={30000} passing={5}>8 のだん</TestButton>
                <TestButton onClick={beginTest} level={1} table={9} time={30000} passing={5}>9 のだん</TestButton>
              </Grid>
            </Grid>
            <Grid container direction='column' alignItems='center' gap={2}>
              <Typography variant='h5'>九九せんせいの試練</Typography>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={2} table={4} time={25000} passing={6}>4 のだん</TestButton>
                <TestButton onClick={beginTest} level={2} table={5} time={25000} passing={6}>5 のだん</TestButton>
                <TestButton onClick={beginTest} level={2} table={6} time={25000} passing={6}>6 のだん</TestButton>
              </Grid>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={2} table={7} time={25000} passing={6}>7 のだん</TestButton>
                <TestButton onClick={beginTest} level={2} table={8} time={25000} passing={6}>8 のだん</TestButton>
                <TestButton onClick={beginTest} level={2} table={9} time={25000} passing={6}>9 のだん</TestButton>
              </Grid>
            </Grid>
            <Grid container direction='column' alignItems='center' gap={2}>
              <Typography variant='h5'>九九たつじんの試練</Typography>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={3} table={4} time={20000} passing={8}>4 のだん</TestButton>
                <TestButton onClick={beginTest} level={3} table={5} time={20000} passing={8}>5 のだん</TestButton>
                <TestButton onClick={beginTest} level={3} table={6} time={20000} passing={8}>6 のだん</TestButton>
              </Grid>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={3} table={7} time={20000} passing={8}>7 のだん</TestButton>
                <TestButton onClick={beginTest} level={3} table={8} time={20000} passing={8}>8 のだん</TestButton>
                <TestButton onClick={beginTest} level={3} table={9} time={20000} passing={8}>9 のだん</TestButton>
              </Grid>
            </Grid>
            <Grid container direction='column' alignItems='center' gap={2}>
              <Typography variant='h5'>九九マスターの試練</Typography>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={4} table={4} time={15000} passing={10}>4 のだん</TestButton>
                <TestButton onClick={beginTest} level={4} table={5} time={15000} passing={10}>5 のだん</TestButton>
                <TestButton onClick={beginTest} level={4} table={6} time={15000} passing={10}>6 のだん</TestButton>
              </Grid>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={4} table={7} time={15000} passing={10}>7 のだん</TestButton>
                <TestButton onClick={beginTest} level={4} table={8} time={15000} passing={10}>8 のだん</TestButton>
                <TestButton onClick={beginTest} level={4} table={9} time={15000} passing={10}>9 のだん</TestButton>
              </Grid>
            </Grid>
            <Grid container direction='column' alignItems='center' gap={2} display={isMastered() ? 'flex' : 'none'}>
              <Typography variant='h5'>九九龍の試練</Typography>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={5} table={4} time={15000} passing={15}>4 のだん</TestButton>
                <TestButton onClick={beginTest} level={5} table={5} time={15000} passing={15}>5 のだん</TestButton>
                <TestButton onClick={beginTest} level={5} table={6} time={15000} passing={15}>6 のだん</TestButton>
              </Grid>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={5} table={7} time={15000} passing={15}>7 のだん</TestButton>
                <TestButton onClick={beginTest} level={5} table={8} time={15000} passing={15}>8 のだん</TestButton>
                <TestButton onClick={beginTest} level={5} table={9} time={15000} passing={15}>9 のだん</TestButton>
              </Grid>
            </Grid>
            <Grid container direction='column' alignItems='center' gap={2} display={isDragon() ? 'flex' : 'none'}>
              <Typography variant='h5'>九九ノ神の試練</Typography>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={6} table={4} time={15000} passing={18}>4 のだん</TestButton>
                <TestButton onClick={beginTest} level={6} table={5} time={15000} passing={18}>5 のだん</TestButton>
                <TestButton onClick={beginTest} level={6} table={6} time={15000} passing={18}>6 のだん</TestButton>
              </Grid>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={6} table={7} time={15000} passing={18}>7 のだん</TestButton>
                <TestButton onClick={beginTest} level={6} table={8} time={15000} passing={18}>8 のだん</TestButton>
                <TestButton onClick={beginTest} level={6} table={9} time={15000} passing={18}>9 のだん</TestButton>
              </Grid>
            </Grid>
            <Grid container direction='column' alignItems='center' gap={2} display={isGod() ? 'flex' : 'none'}>
              <Typography variant='h5'>九九九九の試練</Typography>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={7} table={4} time={15000} passing={20}>4 のだん</TestButton>
                <TestButton onClick={beginTest} level={7} table={5} time={15000} passing={20}>5 のだん</TestButton>
                <TestButton onClick={beginTest} level={7} table={6} time={15000} passing={20}>6 のだん</TestButton>
              </Grid>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={7} table={7} time={15000} passing={20}>7 のだん</TestButton>
                <TestButton onClick={beginTest} level={7} table={8} time={15000} passing={20}>8 のだん</TestButton>
                <TestButton onClick={beginTest} level={7} table={9} time={15000} passing={20}>9 のだん</TestButton>
              </Grid>
            </Grid>
            <Grid container direction='column' alignItems='center' gap={2} display={isKuku() ? 'flex' : 'none'}>
              <Typography variant='h5'>卍の試練</Typography>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={8} table={4} time={15000} passing={23}>4 のだん</TestButton>
                <TestButton onClick={beginTest} level={8} table={5} time={15000} passing={23}>5 のだん</TestButton>
                <TestButton onClick={beginTest} level={8} table={6} time={15000} passing={23}>6 のだん</TestButton>
              </Grid>
              <Grid container gap={1}>
                <TestButton onClick={beginTest} level={8} table={7} time={15000} passing={23}>7 のだん</TestButton>
                <TestButton onClick={beginTest} level={8} table={8} time={15000} passing={23}>8 のだん</TestButton>
                <TestButton onClick={beginTest} level={8} table={9} time={15000} passing={23}>9 のだん</TestButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent='center' position='absolute' top='100dvh' width='100%' height='100dvh'>
            <Grid container position='absolute' left={10} top={10} width={90} zIndex={1} gap={0.5}>
              <Button variant='outlined' sx={{ width: 90, height: 28 }} onClick={finishTest}>やめる</Button>
            </Grid>
            <CountdownTimer count={count} sx={{ position: 'absolute', top: '40dvh', fontSize: 200, transition: count > 0 ? 'opacity 0.2s ease' : 'opacity 0s', opacity: count > 0 ? 1 : 0 }} />
            <Grid container direction='column' maxWidth={700} alignItems='center' position='absolute' bottom={300} display={isTesting.current ? 'flex' : 'none'}>
              <AnsweredList />
            </Grid>
            <Grid container direction='column' maxWidth={700} alignItems='center' gap={3} position='absolute' bottom={60} display={isTesting.current ? 'flex' : 'none'}>
              <Grid container alignItems='center' gap={2}>
                <Typography variant='h1'>{q1}</Typography>
                <Typography variant='h2'>x</Typography>
                <Typography variant='h1'>{q2}</Typography>
              </Grid>
              <Grid container gap={3}>
                <AnswerButton answer={a1} onClick={answer} key={`${questionNo}_${a1}_1`} />
                <AnswerButton answer={a2} onClick={answer} key={`${questionNo}_${a2}_2`} />
                <AnswerButton answer={a3} onClick={answer} key={`${questionNo}_${a3}_3`} />
              </Grid>
            </Grid>
            <Box display={isTestFinished ? 'none' : 'block'} position='absolute' bottom={0} width='100dvw'>
              <Grid position='absolute' width='100dvw' height='10px' bottom={30} container justifyContent='space-around'>
              { new Array(passing).fill(0).map((_, i) => {
                return i < passingCount ? <Circle sx={{ color : '#56f' }}/> : <CircleOutlined sx={{ color : '#cdf' }} />
              })}
              </Grid>
              <Box position='absolute' width='100dvw' height='10px' bottom={0} sx={{ backgroundColor : '#cdf' }}>
                <Box ref={progressRef} position='absolute' height='10px' top={0} left={0} sx={{ backgroundColor : '#56f' }} />
              </Box>
            </Box>
            <Box display={isTestFinished ? 'block' : 'none'}>
              <Grid container direction='column' alignItems='center' gap={2} mt={30}>
                <Typography variant={isPassed ? 'h3' : 'h4'} fontWeight='bold'>{ isPassed ? '試練クリア！' : '試練失敗...orz' }</Typography>
                <Grid container gap={2}>
                  <Button onClick={finishTest} variant='outlined'>戻る</Button>
                  <Button onClick={resetTest} variant='outlined'>もう一回！</Button>
                </Grid>
              </Grid>
            </Box>
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
