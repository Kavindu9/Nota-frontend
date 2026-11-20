"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { DetailsSectionData, StrapiMedia } from "@/lib/strapi";
import styles from "./DetailsSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function DetailsSection({ data }: { data: DetailsSectionData }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: stripes + text fade on the white-area tiles
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-feature]",
          { "--fill": "0%" },
          {
            "--fill": "4.2%",
            ease: "power2.out",
            scrollTrigger: { trigger: "[data-features]", start: "top 80%", end: "top 25%", scrub: 1 },
          }
        );

        gsap.fromTo(
          "[data-feature-text]",
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-features]", start: "top 24%", end: "top 3%", scrub: 1 },
          }
        );
      });

      // Everywhere (except "reduce motion"): play videos only while visible
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLVideoElement>("[data-autoplay]").forEach((video) => {
          ScrollTrigger.create({
            trigger: video,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              if (self.isActive) video.play().catch(() => {});
              else video.pause();
            },
          });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* White area: 2 feature tiles */}
      <div className={styles.light}>
        <div className={styles.features} data-features>
          {data.featureTiles.map((tile) => (
            <div key={tile.id} className={styles.feature} data-feature>
              {tile.image && (
                <Image src={tile.image.url} alt={tile.image.alternativeText ?? ""} fill
                  sizes="(min-width: 900px) 48vw, 100vw" className={styles.media} />
              )}
              {tile.hoverImage && (
                <Image src={tile.hoverImage.url} alt={tile.hoverImage.alternativeText ?? ""} fill
                  sizes="(min-width: 900px) 48vw, 100vw" className={`${styles.media} ${styles.hoverMedia}`} />
              )}
              <div className={styles.featureText} data-feature-text>
                <h3 className={styles.featureTitle}>{tile.title}</h3>
                <p className={styles.featureBody}>{tile.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Black area: 6 gallery tiles (their place in the grid = their order) */}
      <div className={styles.dark}>
        <div className={styles.gallery}>
          {data.galleryTiles.map((tile) => (
            <div key={tile.id} className={styles.tile}>
              {tile.media && <TileMedia media={tile.media} />}
              {tile.label && <span className={styles.pill}>{tile.label}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Shows an <Image> for pictures and a looping <video> for videos
function TileMedia({ media }: { media: StrapiMedia }) {
  if (media.mime.startsWith("video/")) {
    return (
      <video className={styles.media} src={media.url} muted loop playsInline preload="auto"
        aria-label={media.alternativeText ?? undefined} data-autoplay />
    );
  }
  return (
    <Image src={media.url} alt={media.alternativeText ?? ""} fill
      sizes="(min-width: 900px) 72vw, 100vw" className={styles.media} />
  );
}