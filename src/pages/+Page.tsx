import { AnswerButton } from '@/components/AnswerButton';
import { AnsweredList } from '@/components/AnsweredList';
import { useKukuQuestion } from '@/hooks/useKukuQuestion';
import { Grid, Typography } from '@mui/material';

export { Page };

function Page() {
  const { a1, a2, a3, q1, q2, count, answer, isCorrectMode } = useKukuQuestion();
  console.log('===== Page', q1, q2, a1, a2, a3);

  return (
    <Grid container direction='column' alignItems='center' justifyContent='center' height='100vh'>
      <Grid container direction='column' maxWidth={700} alignItems='center' position='absolute' bottom={350}>
        <AnsweredList />
      </Grid>
      <Grid container direction='column' maxWidth={700} alignItems='center' gap={3} position='absolute' bottom={100}>
        <Grid container alignItems='center' gap={2}>
          <Typography variant='h1'>{q1}</Typography>
          <Typography variant='h2'>x</Typography>
          <Typography variant='h1'>{q2}</Typography>
        </Grid>
        <Grid container gap={3}>
          <AnswerButton answer={a1} onClick={answer} key={`${count}_${a1}_1`} isCorrect={isCorrectMode && q1 * q2 === a1} />
          <AnswerButton answer={a2} onClick={answer} key={`${count}_${a2}_2`} isCorrect={isCorrectMode && q1 * q2 === a2} />
          <AnswerButton answer={a3} onClick={answer} key={`${count}_${a3}_3`} isCorrect={isCorrectMode && q1 * q2 === a3} />
        </Grid>
      </Grid>
    </Grid>
  );
}
