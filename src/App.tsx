import { useCallback, useState } from "react";

export const App = () => {

  const [param, setParam] = useState(0);

  const handle = useCallback(() => {
    console.log("execute");
  }, []);

  handle();

  return (
    <div>
      <button onClick={() => setParam(param + 1)}>click</button>
      <p>{param}</p>
    </div>
  );
};
