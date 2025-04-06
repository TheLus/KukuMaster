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
      return '九九将軍';
    }
    if (questionCount < 31) {
      return '九九王';
    }
    if (questionCount < 32) {
      return '九九龍';
    }
    if (questionCount < 33) {
      return '九九ノ鬼';
    }
    if (questionCount < 34) {
      return '九九ノ神';
    }
    if (questionCount < 35) {
      return '九九';
    }
    if (questionCount < 36) {
      return '九九九';
    }
    if (questionCount < 37) {
      return '九九九九';
    }
    if (questionCount < 38) {
      return '九九九九九';
    }
    if (questionCount < 39) {
      return '九九九九九九';
    }
    if (questionCount < 40) {
      return '九九九九九九九';
    }
    return '卍'.repeat(questionCount - 39);
  }, []);

  return { getKukuTitle };
};
