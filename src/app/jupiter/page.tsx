"use client";

import { useEffect, useRef } from "react";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { JupiterModel } from "./model";
import { useRouter } from "next/navigation";

export default function Jupiter() {

  const initialized = useRef(false);
  const router = useRouter()
  const model = useRef<JupiterModel>()

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    model.current = new JupiterModel();
    document.body.appendChild(VRButton.createButton(model.current.renderer));
  }, []);

  function navigateTo(route: string) {
    model.current?.cameraController.zoomOut()

    setTimeout(() => {
      if (model.current) {
        document.body.removeChild(model.current.canvas)
        model.current = undefined
      }
      router.push(route)
    }, 500)
  }

  return (
    <div className="">
      <main className="">
        <button className="m-2 text-gray-100" onClick={() => model.current?.focusOut()}> Visão total </button>
        <button className="m-2 text-gray-100" onClick={() => model.current?.focusOnJupiter()}> Zoom </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/mercury") }> Mercurio </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/venus") }> Venus </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/earth") }> Terra </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/mars") }> Marte </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/saturn") }> Saturno </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/uranus") }> Urano </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/neptune") }> Netuno </button>
      </main>
    </div>
  );
}
