import React, { useEffect, useState } from "react";

export { Page };

function Page() {
  const [c, setC] = useState<number>(0);
  return (
    <div>
      <h1>Hello World</h1>
      <a href="/hoge">to hoge</a>
      <p>now: {c}</p>
      <button onClick={() => setC(c + 1)}>
        Count Up
      </button>
    </div>
  );
}
