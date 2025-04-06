import { useAnsweredList } from '@/hooks/useAnsweredList';
import { Grid, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

const ngIcon = <CloseIcon style={{ color: '#f00', marginLeft: 'auto' }}/>
const okIcon = <CircleOutlinedIcon style={{ color: '#0f0', marginLeft: 'auto' }}/>

type AnsweredListProps = {
  wrap?: boolean;
}

export const AnsweredList = ({ wrap }: AnsweredListProps) => {
  const { answeredList } = useAnsweredList();

  return <Grid container direction='column' alignItems='space-between' height='100%' columnGap={3}>
  {
    answeredList.map(({ formula, isCorrect }, i) => {
      return <Grid container alignItems='center' gap={2}>
        <Typography fontSize={wrap ? 14 : 18} key={i}>{formula}</Typography>
        { isCorrect ? okIcon : ngIcon }
      </Grid>;
    })
  }
</Grid>
}
