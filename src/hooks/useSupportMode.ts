import { useCallback, useState } from 'react';

let _isSupportMode = false;

export const useSupportMode = () => {
  const [isSupportMode, setIsSupportMode] = useState(_isSupportMode);

  const toggleSupportMode = useCallback(() => {
    _isSupportMode = !_isSupportMode;
    setIsSupportMode(_isSupportMode);
  }, []);

  const getIsSupportMode = useCallback(() => {
    return _isSupportMode;
  }, []);

  return { isSupportMode, getIsSupportMode, toggleSupportMode };
};
