import { useCompletedTests } from '@/hooks/useCompletedTests';
import { Star } from '@mui/icons-material';
import { Button } from '@mui/material'
import { useCallback, useMemo } from 'react';

type TestButtonProps = {
  onClick: ({ table, time, passing, level }: { table: number, time: number, passing: number, level: number }) => void;
  children: React.ReactNode;
  table: number;
  time: number;
  passing: number;
  level: number;
}

let touchStartTime = 0;

export const TestButton = ({ children, onClick, table, time, passing, level }: TestButtonProps) => {
  const { getIsComplete, inCorrectTest } = useCompletedTests();
  const handleClick = useCallback(() => {
    onClick({ table, time, passing, level });
  }, [onClick, table, time, passing, level]);

  const handleTouchStart = useCallback(() => {
    touchStartTime = Date.now();
  }, [getIsComplete, level, table]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    if (Date.now() - touchStartTime > 3000) {
      inCorrectTest(level, table);
      e.preventDefault();
    }
  }, [getIsComplete, level, table]);

  const completeType = getIsComplete(level, table);

  return <Button
          onClick={handleClick}
          variant={(completeType === true || completeType === 1) ? 'contained' : 'outlined'}
          sx={{ width: 112 }}
          startIcon={completeType ? <Star /> : undefined}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >{ children }</Button>
}
