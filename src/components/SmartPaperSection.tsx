"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { SmartPaperSectionData } from "@/lib/strapi";
import styles from "./SmartPaperSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COLUMNS = 6; // the white panel -- 6 columns
const INTRO = 2.2; 
const OUTRO = 1; 

export default function SmartPaperSection({ data }: { data: SmartPaperSectionData }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const slides = data.slides;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(wrapperRef.current, { marginTop: "-100vh" });

        const slideEls = gsap.utils.toArray<HTMLElement>("[data-slide]");
        const barEls = gsap.utils.toArray<HTMLElement>("[data-progress]");
        let current = 0;

        const showSlide = (index: number) => {
          if (index === current) return;
          gsap.to(slideEls[current], { autoAlpha: 0, duration: 0.45, overwrite: true });
          gsap.to(slideEls[index], { autoAlpha: 1, duration: 0.45, overwrite: true });
          barEls.forEach((bar, i) => bar.classList.toggle(styles.barActive, i === index));
          current = index;
        };

        const total = INTRO + slides.length + OUTRO;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${total * 100}%`, 
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              const t = self.progress * total;
              const index = Math.min(slides.length - 1, Math.max(0, Math.floor(t - INTRO)));
              showSlide(index);
            },
          },
        });

        tl

          .to("[data-intro]", { autoAlpha: 0, duration: 0.15 }, 0.15)
         
          .fromTo(
            "[data-line]",
            { scaleY: 0 },
            { scaleY: 1, duration: 0.35, ease: "power1.inOut", stagger: { each: 0.08, from: "end" } },
            0.4
          )
          .to("[data-col]", { scaleY: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.1 }, 1.0)
          .to({}, { duration: slides.length + OUTRO }, INTRO);
      });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} id="about" className={styles.wrapper}>
      <section ref={sectionRef} className={styles.section}>
        <div className={styles.stage}>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`${styles.slide} ${slide.imageLayout === "fullscreen" ? styles.fullscreen : ""}`}
              data-slide
            >
              <h3 className={styles.slideHeading}>{slide.heading}</h3>

              {slide.image && (
                <div className={styles.imageBox}>
                  <Image
                    src={slide.image.url}
                    alt={slide.image.alternativeText ?? ""}
                    fill
                    sizes={slide.imageLayout === "fullscreen" ? "100vw" : "50vw"}
                    className={styles.image}
                  />
                </div>
              )}

              <div className={styles.card}>
                <p className={styles.cardTitle}>{slide.cardTitle}</p>
                <p className={styles.cardText}>{slide.cardText}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.progress} aria-hidden="true">
          {slides.map((slide, i) => (
            <span key={slide.id} className={`${styles.bar} ${i === 0 ? styles.barActive : ""}`} data-progress />
          ))}
        </div>

        <div className={styles.cover} aria-hidden="true">
          {Array.from({ length: COLUMNS }, (_, i) => (
            <div key={i} className={styles.col} data-col>
              {i > 0 && <span className={styles.line} data-line />}
            </div>
          ))}
        </div>

        <h2 className={styles.intro} data-intro>
          <span className={styles.eyebrow}>{data.eyebrow}</span>
          <span className={styles.title}>{data.title}</span>
        </h2>
      </section>
    </div>
  );
}