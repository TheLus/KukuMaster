import { Button } from '@mui/material'
import { useCallback } from 'react';

type AnswerButtonProps = {
  onClick: (number: number) => void;
  answer: number;
  isCorrect?: boolean;
}

export const AnswerButton = ({ answer, onClick, isCorrect }: AnswerButtonProps) => {

  const onClickHandler = useCallback(() => {
    onClick?.(answer);
  }, [answer]);

  return <Button
          onClick={onClickHandler}
          sx={{ width: 100, height: 100, fontSize: 46, backgroundColor: isCorrect ? '#dfd' : '#fff' }}
          variant='outlined'
        >{ answer }</Button>
}
