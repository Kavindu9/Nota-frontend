"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { InsideBoxSectionData } from "@/lib/strapi";
import styles from "./InsideBoxSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function InsideBoxSection({ data }: { data: InsideBoxSectionData }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const words = data.description.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        // Pull this section up by TWO screen-heights (it rises invisibly over Smart Paper)
        gsap.set(wrapperRef.current, { marginTop: "-200vh" });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: stageRef.current, start: "top top", end: "+=140%", pin: true, scrub: 1 },
        });

        tl.fromTo("[data-black]", { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "none" }, 0.02)
          .fromTo(
            "[data-circle]",
            { clipPath: "circle(0vmax at 50% 50%)" },
            { clipPath: "circle(75vmax at 50% 50%)", duration: 0.5, ease: "none" },
            0.12
          )
          .fromTo("[data-heading]", { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "none" }, 0.55)
          .to({}, { duration: 0.15 }, 1.25);

        gsap.fromTo(
          "[data-panel]",
          { "--fill": "0%" },
          {
            "--fill": "4.2%",
            ease: "power2.out",
            scrollTrigger: { trigger: "[data-panel]", start: "top 80%", end: "top 25%", scrub: 1 },
          }
        );

        // Panel text fades in
        gsap.fromTo(
          "[data-set]",
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-panel]", start: "top 24%", end: "top 3%", scrub: 1 },
          }
        );

        gsap.fromTo(
          "[data-char]",
          { color: "#d9d9d9" },
          {
            color: "#000000",
            duration: 1,
            stagger: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-description]", start: "top 65%", end: "top 23%", scrub: 1 },
          }
        );
      });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <section ref={stageRef} id="inside-the-box" className={styles.stage}>
        <div className={styles.black} data-black aria-hidden="true" />
        <div className={styles.circle} data-circle aria-hidden="true" />
        <h2 className={styles.heading} data-heading>
          <span className={styles.eyebrow}>{data.eyebrow}</span>
          <span className={styles.title}>{data.title}</span>
        </h2>
      </section>

      <div className={styles.content}>
        <div className={styles.panel} data-panel>
          {data.boxImage && (
            <div className={styles.imageBox}>
              <Image
                src={data.boxImage.url}
                alt={data.boxImage.alternativeText ?? ""}
                fill
                sizes="(min-width: 900px) 36vw, 90vw"
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.set} data-set>
            <h3 className={styles.setTitle}>{data.setTitle}</h3>
            <p className={styles.setText}>{data.setText}</p>
          </div>
        </div>

        <p className={styles.description} data-description>
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
      </div>
    </div>
  );
}