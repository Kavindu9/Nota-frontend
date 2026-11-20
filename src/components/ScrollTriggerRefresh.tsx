"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


export default function ScrollTriggerRefresh() {
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return null; // draws nothing
}
