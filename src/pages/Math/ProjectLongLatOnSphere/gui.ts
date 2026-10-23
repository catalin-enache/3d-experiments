import GUI from "lil-gui";

export interface Params {
  longitude: number;
  latitude: number;
}

export function createGui(
  params: Params,
  { onDirectionChange }: { onDirectionChange: () => void }
) {
  const gui = new GUI();

  gui
    .add(params, "longitude", 0, 2 * Math.PI)
    .name("Longitude")
    .onChange(onDirectionChange);

  gui
    .add(params, "latitude", 0, Math.PI)
    .name("Latitude")
    .onChange(onDirectionChange);

  return gui;
}
