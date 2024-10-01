'use client'

import { useEffect, useRef } from "react";
import { EarthModel } from "./model";
import { VRButton } from 'three/addons/webxr/VRButton.js';

export default function Earth() {

  const initialized = useRef(false)
  const model = useRef<EarthModel>()

  useEffect(() => {

    if (initialized.current) return
    initialized.current = true
    model.current = new EarthModel()
    document.body.appendChild(VRButton.createButton(model.current.renderer));
  }, [])

  return (
    <div className="">
      <main className="">
        <button className="m-2" onClick={() => model.current?.focusOut()}> Visão total </button>
        <button className="m-2" onClick={() => model.current?.focusOnEarth()}> Terra </button>
        <button className="m-2" onClick={() => model.current?.focusOnMoon()}> Lua </button>
      </main>
    </div>
  );
}
