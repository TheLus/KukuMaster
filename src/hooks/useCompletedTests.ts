import { useCallback, useEffect, useState } from "react";

let completedTests: Record<string, boolean> = {};

export const useCompletedTests = () => {

  const completeTest = useCallback((level: number, table: number) => {
    completedTests[`${level}-${table}`] = true;
    localStorage.setItem('completedTests', JSON.stringify(completedTests));
  }, []);

  const inCorrectTest = useCallback((level: number, table: number) => {
    completedTests[`${level}-${table}`] = false;
    localStorage.setItem('completedTests', JSON.stringify(completedTests));
  }, []);

  const getIsComplete = useCallback((level: number, table: number) => {
    return completedTests[`${level}-${table}`];
  }, []);

  useEffect(() => {
    const _completedTests = localStorage.getItem('completedTests');
    if (_completedTests) {
      completedTests = JSON.parse(_completedTests);
    }
  }, []);

  return { completedTests, completeTest, getIsComplete, inCorrectTest };
};
