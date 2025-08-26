import { useState } from "react";


export default function Table({counterHeaderText = "Counter Header"}) {

  const [count, setCount] = useState(0);

  function addValue() {
    if(count < 20) {
      setCount(count + 1);
    }
  }

  function subValue() {
    if(count > 0) {
      setCount(count - 1);
    }
  }


  return (
    <>
      <h1> {counterHeaderText} </h1>
      <h2>{count}</h2>
      <button onClick={addValue}>Increment</button>
      <button onClick={subValue}>Decrement</button>
    </>
  );

}
