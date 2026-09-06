import { useEffect, useRef } from "react";
import type { ScenarioParams } from "@appTypes";

export interface NativeScenarioProps {
  nativeScenario: (props: ScenarioParams) => (() => void) | undefined;
  options?: Omit<ScenarioParams, "container">;
}

export function useNativeScenario({
  nativeScenario,
  options
}: NativeScenarioProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    return nativeScenario({ container: containerRef.current, ...options });
  }, [nativeScenario, options]);

  return containerRef;
}
