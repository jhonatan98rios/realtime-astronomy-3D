"use client";

import { useEffect, useRef } from "react";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { SaturnModel } from "./model";
import { useRouter } from "next/navigation";

export default function Saturn() {

  const router = useRouter()
  const initialized = useRef(false)
  const model = useRef<SaturnModel>()


  useEffect(() => {

    if (initialized.current) return;
    initialized.current = true;
    model.current = new SaturnModel();
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
      <main className=""></main>
    </div>
  );
}
