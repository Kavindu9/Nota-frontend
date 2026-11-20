"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { SpecsSectionData } from "@/lib/strapi";
import styles from "./SpecsSection.module.css";

import StepCurtain from "./StepCurtain";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SpecsSection({ data }: { data: SpecsSectionData }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.from("[data-pen]", { y: () => window.innerHeight * 0.75, duration: 1, ease: "power1.out" });
        tl.from("[data-card]", {
          y: () => window.innerHeight * 0.65,
          duration: 1,
          stagger: 0.25,
          ease: "power2.out",
        }, 0.8);
        tl.to("[data-pen]", { y: -40, duration: 1.5, ease: "none" }, 1);
        tl.to(
          "[data-bar]",
          {
            scaleX: 1,
            duration: 1.6,
            ease: "power1.in",
            stagger: { each: 0.2, from: "end" },
          },
          ">+0.3"
        );

        gsap.set(["[data-pen]", "[data-card]"], { visibility: "visible" });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section} id="#specifications">
      <h2 className={styles.heading}>
        <span className={styles.eyebrow}>{data.eyebrow}</span>
        <span className={styles.title}>{data.title}</span>
      </h2>

      {data.penImage && (
        <div className={styles.pen} data-pen>
          <Image
            src={data.penImage.url}
            alt={data.penImage.alternativeText ?? "Nota pen"}
            width={data.penImage.width}
            height={data.penImage.height}
            loading="eager"
            sizes="20vw"
            className={styles.penImg}
          />
        </div>
      )}

      <div className={styles.cards}>
        {data.groups.map((group) => (
          <article key={group.id} className={styles.card} data-card>
            <h3 className={styles.cardHead}>{group.title}</h3>
            <ul className={styles.cardBody}>
              {group.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <span>{item.label}</span>
                  <span className={styles.dot} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}