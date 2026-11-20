"use client"; // scroll animations + video playback

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { AudienceSectionData } from "@/lib/strapi";
import styles from "./AudienceSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = { data: AudienceSectionData };

export default function AudienceSection({ data }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // handle to the <video>, so we can move its playhead
  const video = data.showcaseVideo;

  const scrubRef = useRef({ progress: 0 });

  const seekVideo = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return; // duration is unknown until the video's info has loaded
    el.currentTime = scrubRef.current.progress * el.duration;
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ---------- Desktop: the full effect ----------
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        // Each persona slides in from the right while it moves up the screen.
        //    One ScrollTrigger PER persona, so each moves on its own.
        gsap.utils.toArray<HTMLElement>("[data-persona]").forEach((persona) => {
          gsap.fromTo(
            persona,
            { x: () => window.innerWidth * 0.4 }, // start 40% of the screen width to the right
            {
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: persona,
                start: "top bottom", // when it appears at the bottom of the screen
                end: "top 15%", 
                scrub: 1.5,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        const freeze = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-card]",
            start: "top 26%",
            end: "+=400%", 
            pin: sectionRef.current, 
            scrub: 1,
          },
        });

        freeze
          .to(
            scrubRef.current,
            { progress: 1, duration: 3, ease: "none", onUpdate: seekVideo },
            0
          )
          .to(
            "[data-card-inner]",
            { scale: 0.68, opacity: 0.35, ease: "power3.in", duration: 2.1 },
            1.4 // starts at 1.4, so it ends together with the video at 3
          );

        // The card grows from 70% to full width, from its top-right corner.
        const freezeTrigger = freeze.scrollTrigger!;
        gsap.fromTo(
          "[data-card]",
          { scale: 0.7 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-card]",
              start: "top bottom",
              end: () => freezeTrigger.start + window.innerHeight * 0.5,
              scrub: 1.5,
              invalidateOnRefresh: true, // recalculate if the window is resized
            },
          }
        );
      });

      // ---------- Phones :the video scrubs while the card passes the screen ----------
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(scrubRef.current, {
          progress: 1,
          ease: "none",
          onUpdate: seekVideo,
          scrollTrigger: {
            trigger: "[data-card]",
            start: "top 85%", // card appears near the bottom → first frame
            end: "bottom 15%", // card leaves near the top → last frame
            scrub: 0.5,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <ul className={styles.personas}>
        {data.personas.map((persona) => (
          <li key={persona.id} className={styles.persona} data-persona>
            <h3 className={styles.personaTitle}>{persona.title}</h3>
            <p className={styles.personaText}>{persona.description}</p>
          </li>
        ))}
      </ul>

      {video && (
        // Outer box: grows (steps 2 + 3a). Inner box: shrinks + fades (step 3c).
        <div className={styles.card} data-card>
          <div className={styles.cardInner} data-card-inner>
            <video
              ref={videoRef}
              className={styles.cardVideo}
              src={video.url}
              muted 
              playsInline
              preload="auto" 
              onLoadedMetadata={seekVideo} 
              aria-label={video.alternativeText ?? "Nota pen"}
            />
          </div>
        </div>
      )}
    </section>
  );
}
