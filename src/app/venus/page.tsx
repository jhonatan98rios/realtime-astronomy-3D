"use client";

import { useEffect, useRef } from "react";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { VenusModel } from "./model";
import { useRouter } from "next/navigation";

export default function Venus() {

  const router = useRouter()
  const initialized = useRef(false)
  const model = useRef<VenusModel>()


  useEffect(() => {

    if (initialized.current) return;
    initialized.current = true;
    model.current = new VenusModel();
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
    <div className="bg-black">
      <main className="">
        <button className="m-2 text-gray-100" onClick={() => model.current?.focusOut()}> Visão total </button>
        <button className="m-2 text-gray-100" onClick={() => model.current?.focusOnVenus()}> Zoom </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/mercury") }> Mercurio </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/earth") }> Terra </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/mars") }> Marte </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/jupiter") }> Jupiter </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/saturn") }> Saturno </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/uranus") }> Urano </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/neptune") }> Netuno </button>
      </main>
    </div>
  );
}
