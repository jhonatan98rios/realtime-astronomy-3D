"use client";

import { useEffect, useRef } from "react";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { JupiterModel } from "./model";

export default function Mars() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const model = new JupiterModel();
    document.body.appendChild(VRButton.createButton(model.renderer));
  }, []);

  return (
    <div className="">
      <main className=""></main>
    </div>
  );
}
