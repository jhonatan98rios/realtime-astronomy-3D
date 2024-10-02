'use client'

import { useEffect, useRef } from "react";
import { EarthModel } from "./model";
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { useRouter } from "next/navigation";

export default function Earth() {

  const router = useRouter()
  const initialized = useRef(false)
  const model = useRef<EarthModel>()

  useEffect(() => {

    if (initialized.current) return
    initialized.current = true
    model.current = new EarthModel()
    document.body.appendChild(VRButton.createButton(model.current.renderer));

  }, [])

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
        <button className="m-2 text-gray-100" onClick={() => model.current?.focusOnEarth()}> Terra </button>
        <button className="m-2 text-gray-100" onClick={() => model.current?.focusOnMoon()}> Lua </button>
        <button className="m-2 text-gray-100" onClick={() => navigateTo("/mars") }> Marte </button>
      </main>
    </div>
  );
}
