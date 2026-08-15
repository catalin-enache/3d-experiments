import { useEffect, useRef } from 'react';

type Scenario = (container: HTMLElement) => (() => void) | undefined;

export function useNativeScenario(scenario: Scenario) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    return scenario(containerRef.current);
  }, [scenario]);

  return containerRef;
}
