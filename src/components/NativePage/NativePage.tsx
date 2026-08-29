import { useNativeScenario, type NativeScenario } from "@hooks";
import classes from "./NativePage.module.css";

interface NativePageProps {
  nativeScenario: NativeScenario;
}

export const NativePage = ({ nativeScenario }: NativePageProps) => {
  return (
    <div
      ref={useNativeScenario(nativeScenario)}
      className={classes.nativePage}
    />
  );
};
