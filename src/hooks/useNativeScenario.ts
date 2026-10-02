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
    let disposed = false;
    if (typeof res === "function") {
      cleanup = res;
    } else if (res instanceof Promise) {
      void res.then((_cleanup) => {
        // The effect may have been cleaned up (e.g. StrictMode double-mount)
        // before the async scenario finished initializing.
        if (disposed) {
          _cleanup();
        } else {
          cleanup = _cleanup;
        }
      });
    }
    return () => {
      disposed = true;
      if (cleanup) {
        cleanup();
      }
    };
  }, [nativeScenario, options]);

  return containerRef;
}
