'use client'

import { useEffect, useRef } from "react";
import { MarsModel } from "./model";
import { VRButton } from 'three/addons/webxr/VRButton.js';

export default function Mars() {

  const initialized = useRef(false)

  useEffect(() => {

    if (initialized.current) return
    initialized.current = true
    const model = new MarsModel()
    document.body.appendChild(VRButton.createButton(model.renderer));
  }, [])

  return (
    <div className="">
      <main className="">
        
      </main>
    </div>
  );
}
