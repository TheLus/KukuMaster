import { AnswerButton } from '@/components/AnswerButton';
import { AnsweredList } from '@/components/AnsweredList';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useAnsweredList } from '@/hooks/useAnsweredList';
import { useKukuQuestion } from '@/hooks/useKukuQuestion';
import { useKukuTitle } from '@/hooks/useKukuTitle';
import { useTimeAttackMode } from '@/hooks/useTimeAttackMode';
import { Box, Button, Grid, SxProps, Typography } from '@mui/material';

export { Page };

function Page() {
  const { a1, a2, a3, q1, q2, questionNo, answer, reset, isCorrectMode } = useKukuQuestion();
  const { correctRatio } = useAnsweredList();
  const { toggleTimeAttackMode, resetTimeAttack, resultCount, isTimeAttackFinished, isTimeAttackMode, count, questionNoOffset, isTimeAttacking, progressRef } = useTimeAttackMode({ questionNo, reset });
  const { getKukuTitle } = useKukuTitle();

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
              <Grid container alignItems='center' width='100%' height='calc(100dvh - 555px)' mb={-3} justifyContent='center'>
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
