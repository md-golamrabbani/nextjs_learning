"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { addByAmount, decrement, increment } from "../store/counterSlice";

export default function HomePage() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <main className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-3xl font-bold">Redux Counter</h1>
      <p className="text-xl">Count: {count}</p>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Decrement
        </button>
        <button
          onClick={() => dispatch(addByAmount(5))}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add 5
        </button>
      </div>
    </main>
  );
}
