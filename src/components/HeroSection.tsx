"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { HeroSectionData } from "@/lib/strapi";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Timeline units (1 unit = 1 screen-height of scrolling while the hero is frozen)
export const HERO_VIDEO = 3; 
export const HERO_FADE = 0.35; 
export const HERO_TRIGGER_ID = "hero";
type Props = { data: HeroSectionData };

export default function HeroSection({ data }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = data.heroVideo;


  const scrubRef = useRef({ progress: 0 });

  const seekVideo = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return; // the video's length isn't known until its info has loaded
    el.currentTime = scrubRef.current.progress * el.duration;
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ---------- Desktop: freeze, scrub the video, then fade out ----------
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {

        gsap.set(wrapperRef.current, { marginBottom: "-64vh" });

        const tl = gsap.timeline({
          scrollTrigger: {
            id: HERO_TRIGGER_ID,
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${(HERO_VIDEO + HERO_FADE) * 100}%`,
            pin: true,
            scrub: 1, 
          },
        });

        tl
          // the video, first frame to last frame
          .to(scrubRef.current, { progress: 1, duration: HERO_VIDEO, ease: "none", onUpdate: seekVideo }, 0)
          .to(sectionRef.current, { autoAlpha: 0, duration: HERO_FADE, ease: "none" }, HERO_VIDEO);
      });

      // ---------- Phones: no freezing, the video moves while the hero scrolls away ----------
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(scrubRef.current, {
          progress: 1,
          ease: "none",
          onUpdate: seekVideo,
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.5 },
        });
      });
    },
    { scope: wrapperRef }
  );

  return (
    // The wrapper sits ABOVE the Specs section (z-index) while Specs slides in underneath
    <div ref={wrapperRef} className={styles.wrapper}>
      <section ref={sectionRef} className={styles.hero} data-hero>
        {video && (
          <video
            ref={videoRef}
            className={styles.video}
            src={video.url}
            poster={data.posterImage?.url}
            muted
            playsInline
            preload="auto" 
            onLoadedMetadata={seekVideo} 
            aria-hidden="true"
          />
        )}

        {/* whitespace: pre-line in the CSS keeps the Enter-key line break from Strapi */}
        <h1 className={styles.title}>{data.title}</h1>
      </section>
    </div>
  );
}
