"use client";

import { useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { FooterData } from "@/lib/strapi";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer({ data }: { data: FooterData }) {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          innerRef.current,
          { y: () => -(footerRef.current?.offsetHeight ?? 0) },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    },
    { scope: footerRef }
  );

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, url: string) => {
    if (!url.startsWith("#")) return;
    const target = document.querySelector<HTMLElement>(url);
    if (!target) return;

    event.preventDefault();
    const spacer = target.parentElement?.classList.contains("pin-spacer") ? target.parentElement : null;
    const box = spacer ?? target;
    const top = box.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", url);
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div ref={innerRef} className={styles.inner}>
        <div className={styles.top}>
          <p className={styles.about}>{data.about}</p>
          <div className={styles.columns}>
            <nav aria-label="Footer">
              <p className={styles.label}>Navigation</p>
              <ul className={styles.links}>
                {data.links.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} onClick={(event) => scrollToSection(event, link.url)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.year}>
              <p className={styles.label}>Year</p>
              <p className={styles.yearValue}>{data.year}</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{data.copyright}</p>
          <p className={styles.madeBy}>{data.madeBy}</p>
          <p className={styles.credit}>{data.credit}</p>
        </div>
      </div>
    </footer>
  );
}