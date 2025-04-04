const answeredList: string[] = [];

const addAnsweredList = (answer: string) => {
  answeredList.push(answer);
}
export const useAnsweredList = () => {
  return {
    answeredList,
    addAnsweredList,
  }
};
