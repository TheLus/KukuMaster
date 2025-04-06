import { useCallback } from 'react';

export const useKukuTitle = () => {
  const getKukuTitle = useCallback((questionCount:number, correctRatio: number) => {
    if (questionCount === 0) {
      return 'ねてるのかな？';
    }
    if (questionCount > 30 && correctRatio < 0.4) {
      return 'まじめに\nやりましょう';
    }
    if (questionCount < 5 || correctRatio < 0.3) {
      return '九九あかちゃん';
    }
    if (questionCount < 10 || correctRatio < 0.6) {
      return '九九みならい';
    }
    if (questionCount < 15 || correctRatio < 0.9) {
      return '九九せんせい';
    }
    if (questionCount < 20 || correctRatio < 1) {
      return '九九たつじん';
    }
    if (questionCount < 25) {
      return '九九マスター！';
    }
    if (questionCount < 30) {
      return '九九ノ鬼';
    }
    return '九九ノ神';
  }, []);

  return { getKukuTitle };
};
