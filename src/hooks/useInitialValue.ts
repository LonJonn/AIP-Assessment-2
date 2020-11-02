import { useRef } from "react";

/**
 * Helper hook for remembering an initial value throughout a
 * component lifecycle.
 *
 * Especially useful when dealing with page transition that
 * relay on router state prior the transition e.g. favour id
 */
export default function useInitialValue<T>(value: T) {
  const ref = useRef(value);
  return ref.current;
}
