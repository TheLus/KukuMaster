import { useEffect } from 'react';

/**
 * sp 用の --vh を生成するための hooks
 */
export const useSpVh = () => {
  useEffect(() => {
    const handleResize = () => {
      /**
       * アドレスバー+ツールバーを除いた 1% の高さ(px)を css 変数に格納
       */
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.documentElement.style.removeProperty('--vh');
    };
  }, []);
};
