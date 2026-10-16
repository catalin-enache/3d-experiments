import { palette } from "./palette";
import type { View } from "./settings";

// HTML labels over the two halves and a legend of the stencil colors
export function createOverlay(container: HTMLElement) {
  // the overlay is placed over the container
  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:absolute;inset:0;pointer-events:none;font:12px monospace;color:#ddd";
  const labelStyle =
    "position:absolute;top:8px;padding:2px 6px;background:rgba(0,0,0,0.6)";
  const colorLabel = document.createElement("div");
  colorLabel.textContent = "color buffer";
  colorLabel.style.cssText = `${labelStyle};left:8px`;
  const stencilLabel = document.createElement("div");
  stencilLabel.textContent = "stencil buffer";
  stencilLabel.style.cssText = labelStyle;
  const legend = document.createElement("div");
  legend.style.cssText =
    "position:absolute;bottom:8px;padding:4px 6px;background:rgba(0,0,0,0.6);display:flex;flex-wrap:wrap;gap:3px;max-width:calc(50% - 32px)";
  const addSwatch = (value: number) => {
    const [r, g, b] = palette[value];
    const swatch = document.createElement("div");
    swatch.textContent = String(value);
    const textColor = r + g + b > 380 ? "#000" : "#fff";
    swatch.style.cssText = `min-width:20px;padding:0 2px;text-align:center;background:rgb(${[r, g, b].join(",")});color:${textColor}`;
    legend.appendChild(swatch);
  };
  for (let value = 0; value < 16; ++value) addSwatch(value);
  const grays = document.createElement("div");
  grays.textContent = "16 .. 247";
  grays.style.cssText =
    "padding:0 6px;background:linear-gradient(to right,rgb(16,16,16),rgb(247,247,247));color:#f44";
  legend.appendChild(grays);
  for (let value = 248; value < 256; ++value) addSwatch(value);
  overlay.append(colorLabel, stencilLabel, legend);
  container.appendChild(overlay);

  // shows the labels of the visible views, in the right place
  function update(view: View) {
    const split = view === "split";
    colorLabel.style.display = view === "stencil" ? "none" : "";
    stencilLabel.style.display = view === "color" ? "none" : "";
    stencilLabel.style.left = split ? "calc(50% + 8px)" : "8px";
    legend.style.left = split ? "calc(50% + 8px)" : "8px";
    legend.style.display = view === "color" ? "none" : "flex";
  }

  function dispose() {
    container.removeChild(overlay);
  }

  return { update, dispose };
}
