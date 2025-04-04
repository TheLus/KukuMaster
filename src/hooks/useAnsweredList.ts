const answeredList: { formula: string, isCorrect: boolean }[] = [];

const addAnsweredList = (formula: string, isCorrect: boolean) => {
  answeredList.push({
    formula,
    isCorrect,
  });
}
export const useAnsweredList = () => {
  return {
    answeredList,
    addAnsweredList,
  }
};
