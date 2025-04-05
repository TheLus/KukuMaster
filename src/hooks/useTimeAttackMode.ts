import { useCallback, useEffect, useState } from 'react';
import { useSound } from './useSound';
import { useAnsweredList } from './useAnsweredList';
import { useQuery } from './useQuery';


export const useTimeAttackMode = () => {
  const [isTimeAttackMode, setIsTimeAttackMode] = useState(false);

  const toggleTimeAttackMode = useCallback(() => {
    setIsTimeAttackMode((current) => !current);
  }, []);

  return { isTimeAttackMode, toggleTimeAttackMode }
};
