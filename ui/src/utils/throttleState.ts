import * as React from "react";

export function useThrottleState<T>(
  current: T,
  updateBackingValue: (newValue: T) => void,
  {
    timeout = 300,
    immediatelyUpdateIfFalsey = false,
  }: { timeout?: number; immediatelyUpdateIfFalsey?: boolean } = {}
): [T, (newValue: T) => void] {
  const [value, setValue] = React.useState(current);
  const timeoutRef = React.useRef<number | undefined>();
  const updateBackingValueRef = React.useRef(updateBackingValue);

  React.useEffect(() => {
    setValue(current);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, [current]);

  // make sure the delayed update will always
  // run the correct callback
  React.useEffect(() => {
    updateBackingValueRef.current = updateBackingValue;
  }, [updateBackingValue]);

  const update = React.useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      let time = timeout;
      if (immediatelyUpdateIfFalsey && !newValue) {
        time = 0;
      }
      timeoutRef.current = window.setTimeout(() => {
        updateBackingValueRef.current(newValue);
      }, time);
    },
    [immediatelyUpdateIfFalsey, timeout]
  );

  return [value, update];
}
