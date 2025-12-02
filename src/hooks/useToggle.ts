import { useState } from "react";

export const useToggle = (): [boolean, () => void] => {
  const [state, setState] = useState(false);
  const toggle = () => setState((prev) => !prev);

  return [state, toggle];
};
