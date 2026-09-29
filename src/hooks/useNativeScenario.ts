import { useEffect, useRef } from "react";
import type { ScenarioParams } from "@appTypes";

export interface NativeScenarioProps {
  nativeScenario: (props: ScenarioParams) => (() => void) | Promise<() => void>;
  options?: Omit<ScenarioParams, "container">;
}

export function useNativeScenario({
  nativeScenario,
  options
}: NativeScenarioProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const res = nativeScenario({
      container: containerRef.current,
      ...options
    });

    let cleanup: (() => void) | undefined;
    if (typeof res === "function") {
      cleanup = res;
    } else if (res instanceof Promise) {
      void res.then((_cleanup) => {
        cleanup = _cleanup;
      });
    }
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [nativeScenario, options]);

  return containerRef;
}
