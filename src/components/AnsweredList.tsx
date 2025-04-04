import { useAnsweredList } from '@/hooks/useAnsweredList';
import { Grid, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

const ngIcon = <CloseIcon style={{ color: '#f00', marginLeft: 'auto' }}/>
const okIcon = <CircleOutlinedIcon style={{ color: '#0f0', marginLeft: 'auto' }}/>

export const AnsweredList = () => {
  const { answeredList } = useAnsweredList();

  return <Grid container direction='column' alignItems='space-between'>
  {
    answeredList.map(({ formula, isCorrect }, i) => {
      return <Grid container alignItems='center' gap={2}>
        <Typography fontSize={18} key={i}>{formula}</Typography>
        { isCorrect ? okIcon : ngIcon }
      </Grid>;
    })
  }
</Grid>
}
