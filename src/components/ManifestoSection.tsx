"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ManifestoSectionData } from "@/lib/strapi";
import styles from "./ManifestoSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ManifestoSection({ data }: { data: ManifestoSectionData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const words = data.statement.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Statement fades in near the top of the screen
        gsap.fromTo(
          "[data-statement]",
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-statement]",
              start: "top 40%",
              end: "top 18%",
              scrub: true,
            },
          }
        );

        // Letters turn grey to white, one after another
        gsap.fromTo(
          "[data-char]",
          { color: "#666666" },
          {
            color: "#ffffff",
            duration: 1,
            stagger: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-statement]",
              start: "top 30%",
              end: "bottom 35%",
              scrub: 1.5,
            },
          }
        );

        gsap.from("[data-audience]", {
          opacity: 0,
          duration: 0.8,
          ease: "power1.out",
          scrollTrigger: {
            trigger: "[data-audience]",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="who-its-for" className={styles.section}>
      <p className={styles.statement} data-statement>
        {words.map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            <span className={styles.word}>
              {Array.from(word).map((char, charIndex) => (
                <span key={charIndex} data-char>{char}</span>
              ))}
            </span>
            {wordIndex < words.length - 1 && " "}
          </Fragment>
        ))}
      </p>

      <div className={styles.audience} data-audience>
        <p className={styles.label}>{data.audienceLabel}</p>
        <div className={styles.paragraphs}>
          {data.audienceParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}