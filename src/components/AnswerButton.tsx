import { Button } from '@mui/material'
import { useCallback } from 'react';

type AnswerButtonProps = {
  onClick: (number: number) => void;
  answer: number;
}

export const AnswerButton = ({ answer, onClick }: AnswerButtonProps) => {

  const onClickHandler = useCallback(() => {
    onClick?.(answer);
  }, [answer]);

  return <Button
          onClick={onClickHandler}
          sx={{ width: 100, height: 100, fontSize: 46 }}
          variant='outlined'
        >{ answer }</Button>
}
