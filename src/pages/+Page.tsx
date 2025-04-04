import { AnswerButton } from '@/components/AnswerButton';
import { useKukuQuestion } from '@/hooks/useKukuQuestion';
import { Grid, Typography } from '@mui/material';

export { Page };

function Page() {
  const { a1, a2, a3, q1, q2, answer } = useKukuQuestion();

  return (
    <Grid container direction='column' alignItems='center' justifyContent='center' height='100vh'>
      <Grid container direction='column' maxWidth={700} alignItems='center' gap={3} position='absolute' bottom={400}>
        <Typography>4 x 2 = 8</Typography>
      </Grid>
      <Grid container direction='column' maxWidth={700} alignItems='center' gap={3} position='absolute' bottom={100}>
        <Grid container alignItems='center' gap={2}>
          <Typography variant='h1'>{q1}</Typography>
          <Typography variant='h2'>x</Typography>
          <Typography variant='h1'>{q2}</Typography>
        </Grid>
        <Grid container gap={3}>
          <AnswerButton answer={a1} onClick={answer} />
          <AnswerButton answer={a2} onClick={answer} />
          <AnswerButton answer={a3} onClick={answer} />
        </Grid>
      </Grid>
    </Grid>
  );
}
