"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ColorsSectionData } from "@/lib/strapi";
import styles from "./ColorsSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const UNIT_PER_SLIDE = 0.5; // each slide stays for half a screen-height of scrolling

export default function ColorsSection({ data }: { data: ColorsSectionData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const slides = data.slides;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const slideEls = gsap.utils.toArray<HTMLElement>("[data-color-slide]");
        const barEls = gsap.utils.toArray<HTMLElement>("[data-color-bar]");
        let current = 0;

        const showSlide = (index: number) => {
          if (index === current) return;
          gsap.to(slideEls[current], { autoAlpha: 0, duration: 0.45, overwrite: true });
          gsap.to(slideEls[index], { autoAlpha: 1, duration: 0.45, overwrite: true });
          barEls.forEach((bar, i) => bar.classList.toggle(styles.barActive, i === index));
          current = index;
        };

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${slides.length * UNIT_PER_SLIDE * 100}%`,
          pin: true,
          onUpdate: (self) => {
            const index = Math.min(slides.length - 1, Math.floor(self.progress * slides.length));
            showSlide(index);
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="colors" className={styles.section}>
      {slides.map((slide) => (
        <div
          key={slide.id}
          className={styles.slide}
          data-color-slide
          style={
            {
              "--top": slide.gradientTop,
              "--middle": slide.gradientMiddle,
              "--bottom": slide.gradientBottom,
              "--text": slide.textColor,
            } as CSSProperties
          }
        >
          {slide.penImage && (
            <Image
              src={slide.penImage.url}
              alt={slide.penImage.alternativeText ?? ""}
              fill
              sizes="100vw"
            //   className={styles.pen}
            className="object-cover object-center"
            />
          )}
          <p className={styles.left}>{slide.leftText}</p>
          <p className={styles.right}>{slide.rightText}</p>
        </div>
      ))}

      <div className={styles.progress} aria-hidden="true">
        {slides.map((slide, i) => (
          <span key={slide.id} className={`${styles.bar} ${i === 0 ? styles.barActive : ""}`} data-color-bar />
        ))}
      </div>
    </section>
  );
}