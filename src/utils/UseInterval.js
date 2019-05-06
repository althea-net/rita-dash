import { useEffect, useRef } from "react";
const AbortController = window.AbortController;

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;

      savedCallback.current(signal);
      function tick() {
        savedCallback.current(signal);
      }

      let id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
        controller.abort();
      };
    },
    [delay]
  );
}
