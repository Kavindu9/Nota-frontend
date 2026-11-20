"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { MainNavData, NotifyPopupData } from "@/lib/strapi";
import { scrollToSection } from "@/lib/scrollToSection";
import { HERO_FADE, HERO_TRIGGER_ID, HERO_VIDEO } from "./HeroSection";
import NotifyPopup from "./NotifyPopup";
import styles from "./MainNav.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Hide the nav when the hero video is 90% done
const HIDE_AT = 0.9;

type Props = { data: MainNavData; popup: NotifyPopupData };

const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function MainNav({ data, popup }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  // Before launch the Order button opens the "Stay ahead" popup.
  const opensPopup = !data.orderUrl || data.orderUrl === "#";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean };


          const makeHide = (selector: string, delay: number) =>
            gsap.timeline({ paused: true }).to(selector, {
              y: (_i: number, el: HTMLElement) =>
                -(el.getBoundingClientRect().bottom + 10),
              duration: reduce ? 0 : 0.4,
              delay: reduce ? 0 : delay,
              ease: "power2.inOut",
            });
          const hideLinks = makeHide("[data-nav-links]", 0);
          const hideBox = makeHide("[data-nav-box]", 0.06);

          
          const hideFrom = () => {
            const hero = ScrollTrigger.getById(HERO_TRIGGER_ID); 
            if (hero) {
              const videoPart = HERO_VIDEO / (HERO_VIDEO + HERO_FADE); 
              return hero.start + (hero.end - hero.start) * videoPart * HIDE_AT;
            }
            return window.innerHeight * 0.5;
          };

          ScrollTrigger.create({
            start: 0,
            end: "max", // the whole page
            onUpdate: (self) => {
              const pastHero = self.scroll() > hideFrom();
              if (!pastHero) {
                hideLinks.reverse();
                hideBox.reverse();
              } else {
                hideLinks.play();
                if (self.direction === -1) hideBox.reverse();
                else hideBox.play();
              }
            },
          });
        },
      );
    },
    { scope: navRef },
  );

  return (
    <header ref={navRef} className={styles.nav}>
      {/* ---------- Left: logo + links ---------- */}
      <nav className={styles.left} aria-label="Main" data-nav-links>
        {/* the logo scrolls back to the very top */}
        <a href="#" className={styles.logo} onClick={scrollToTop}>
          {data.logo ? (
            <Image
              src={data.logo.url}
              alt={data.logoText}
              width={data.logo.width ?? 64}
              height={data.logo.height ?? 24}
              className={styles.logoImg}
              priority 
            />
          ) : (
            data.logoText
          )}
        </a>

        <ul className={styles.links}>
          {data.links.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                className={styles.link}
                onClick={(event) => scrollToSection(event, link.url)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ---------- Right: white box with the icon + order button ---------- */}
      <div className={styles.box} data-nav-box>
        {data.brandMark && (
          <Image
            src={data.brandMark.url}
            alt={data.brandMark.alternativeText ?? ""}
            width={40}
            height={40}
            className={styles.mark}
            priority
          />
        )}

        {opensPopup ? (
          <button type="button" className={styles.order} onClick={() => setPopupOpen(true)}>
            <OrderText data={data} />
          </button>
        ) : (
          <a href={data.orderUrl} className={styles.order}>
            <OrderText data={data} />
          </a>
        )}
      </div>

      {/* Only exists while open, so it starts fresh every time */}
      {popupOpen && <NotifyPopup data={popup} onClose={() => setPopupOpen(false)} />}
    </header>
  );
}

function OrderText({ data }: { data: MainNavData }) {
  return (
    <>
      {data.orderLabel} <span className={styles.product}>{data.orderProduct}</span>
      <span className={styles.dot} aria-hidden="true">
        •
      </span>
      {data.orderPrice}
    </>
  );
}
