import { useCallback, useEffect, useState } from "react";
import { useSupportMode } from "./useSupportMode";

let completedTests: Record<string, boolean |number> = {};

export const useCompletedTests = () => {
  const { getIsSupportMode } = useSupportMode();

  const completeTest = useCallback((level: number, table: number) => {
    completedTests[`${level}-${table}`] = getIsSupportMode() ? 2 : 1;
    localStorage.setItem('completedTests', JSON.stringify(completedTests));
  }, []);

  const inCorrectTest = useCallback((level: number, table: number) => {
    completedTests[`${level}-${table}`] = 0;
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
