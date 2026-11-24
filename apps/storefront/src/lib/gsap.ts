"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(CustomEase, ScrollTrigger, ScrollToPlugin, Flip, SplitText);
  CustomEase.create("paperSettle", "0.22, 1, 0.36, 1");
  registered = true;
}

export { gsap, ScrollTrigger, Flip };
