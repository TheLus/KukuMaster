import { AnswerButton } from '@/components/AnswerButton';
import { Grid, Typography } from '@mui/material';
import { useCallback, useState } from "react";

export { Page };

function Page() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const setQuestion = useCallback(() => {
    setA(Math.floor(Math.random() * 8) + 2);
    setB(Math.floor(Math.random() * 8) + 2);
  }, []);

  return (
    <Grid container direction='column' alignItems='center' justifyContent='center' height='100vh'>
      <Grid container direction='column' maxWidth={700} alignItems='center' gap={3}>
        <Grid container alignItems='center' gap={2}>
          <Typography variant='h1'>{a}</Typography>
          <Typography variant='h2'>x</Typography>
          <Typography variant='h1'>{b}</Typography>
        </Grid>
        <Grid container gap={3}>
          <AnswerButton answer={16} onClick={setQuestion} />
          <AnswerButton answer={18} onClick={setQuestion} />
          <AnswerButton answer={20} onClick={setQuestion} />
        </Grid>
      </Grid>
    </Grid>
  );
}
