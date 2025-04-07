import { useAnsweredList } from '@/hooks/useAnsweredList';
import { Grid, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

const NgIcon = ({ size }: { size: number }) => <CloseIcon style={{ color: '#f00', marginLeft: 'auto', width: size, height: size }}/>
const OkIcon = ({ size }: { size: number }) => <CircleOutlinedIcon style={{ color: '#0f0', marginLeft: 'auto', width: size, height: size }}/>

type AnsweredListProps = {
  wrap?: boolean;
}

export const AnsweredList = ({ wrap }: AnsweredListProps) => {
  const { answeredList } = useAnsweredList();

  return <Grid container direction='column' alignItems='space-between' height='100%' width='fit-content' columnGap={3}>
  {
    answeredList.map(({ formula, isCorrect }, i) => {
      return <Grid container alignItems='center' gap={wrap ? 1 : 2}>
        <Typography fontSize={wrap ? 12 : 18} key={i}>{formula}</Typography>
        { isCorrect ? <OkIcon size={wrap ? 18 : 24} /> : <NgIcon size={wrap ? 18 : 24} /> }
      </Grid>;
    })
  }
</Grid>
}
