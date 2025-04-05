let answeredList: { formula: string, isCorrect: boolean }[] = [];

let correctRatio = 0;

const addAnsweredList = (formula: string, isCorrect: boolean) => {
  answeredList.push({
    formula,
    isCorrect,
  });
  correctRatio = answeredList.filter(({ isCorrect }) => isCorrect).length / answeredList.length;
}

const resetAnsweredList = () => {
  answeredList = [];
}

export const useAnsweredList = () => {
  return {
    answeredList,
    correctRatio,
    addAnsweredList,
    resetAnsweredList,
  }
};
