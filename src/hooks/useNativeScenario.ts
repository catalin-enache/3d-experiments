import { useEffect, useRef } from 'react';

export type NativeScenario = (
  container: HTMLElement
) => (() => void) | undefined;

export function useNativeScenario(nativeScenario: NativeScenario) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    return nativeScenario(containerRef.current);
  }, [nativeScenario]);

  return containerRef;
}
