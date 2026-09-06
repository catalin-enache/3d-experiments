import { useNativeScenario, type NativeScenarioProps } from "@hooks";
import classes from "./NativePage.module.css";

export const NativePage = (props: NativeScenarioProps) => {
  return <div ref={useNativeScenario(props)} className={classes.nativePage} />;
};
