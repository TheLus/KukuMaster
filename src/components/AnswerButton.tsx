import { Button } from '@mui/material'

type AnswerButtonProps = {
  onClick: () => void;
  answer: number;
}

export const AnswerButton = ({ answer, onClick }: AnswerButtonProps) => {
  return <Button
          onClick={onClick}
          sx={{ width: 100, height: 100, fontSize: 46 }}
          variant='outlined'
        >{ answer }</Button>
}
