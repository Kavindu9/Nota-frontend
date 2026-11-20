import { cacheLife } from "next/cache";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";


export type SpecItem = { id: number; label: string };

export type SpecGroup = { id: number; title: string; items: SpecItem[] };

export type StrapiImage = {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
};

export type SpecsSectionData = {
  eyebrow: string;
  title: string;
  penImage: StrapiImage | null;
  groups: SpecGroup[];
};

// What the Manifesto component receives
export type ManifestoSectionData = {
  statement: string;
  audienceLabel: string;
  audienceParagraphs: string[]; 
};

export type StrapiVideo = {
  url: string;
  mime: string; // video/mp4
  alternativeText: string | null;
};

export type Persona = { id: number; title: string; description: string };

export type AudienceSectionData = {
  personas: Persona[];
  showcaseVideo: StrapiVideo | null;
};

export type SmartPaperSlide = {
  id: number;
  heading: string; 
  image: StrapiImage | null;
  imageLayout: "centered" | "fullscreen";
  cardTitle: string;
  cardText: string;
};

export type SmartPaperSectionData = {
  eyebrow: string;
  title: string;
  slides: SmartPaperSlide[];
};

export type InsideBoxSectionData = {
  eyebrow: string;
  title: string;
  boxImage: StrapiImage | null;
  setTitle: string;
  setText: string;
  description: string;
};

// An image OR a video
export type StrapiMedia = {
  url: string;
  mime: string; // "image/jpeg", "video/mp4", …
  alternativeText: string | null;
  width: number | null; // null for videos
  height: number | null;
};

export type FeatureTile = {
  id: number;
  title: string;
  text: string;
  image: StrapiImage | null;
  hoverImage: StrapiImage | null; // optional: shown while the mouse is over the tile
};

export type GalleryTile = {
  id: number;
  media: StrapiMedia | null;
  label: string | null; 
};

export type DetailsSectionData = {
  featureTiles: FeatureTile[];
  galleryTiles: GalleryTile[];
};

export type ColorSlide = {
  id: number;
  leftText: string;
  rightText: string;
  penImage: StrapiImage | null;
  textColor: string; // "#ffffff"
  gradientTop: string;
  gradientMiddle: string;
  gradientBottom: string;
};

export type ColorsSectionData = { slides: ColorSlide[] };

export type FooterLink = { id: number; label: string; url: string };

export type FooterData = {
  about: string;
  links: FooterLink[];
  year: string;
  copyright: string;
  madeBy: string;
  credit: string;
};

// ---------- Main Nav ----------
export type MainNavData = {
  logoText: string; // shown when no logo picture is uploaded
  logo: StrapiMedia | null;
  links: FooterLink[]; // same component as the footer links (label + url)
  brandMark: StrapiMedia | null; 
  orderLabel: string; 
  orderProduct: string; 
  orderPrice: string; 
  orderUrl: string;
};

// ---------- Hero ----------
export type HeroSectionData = {
  title: string; 
  heroVideo: StrapiMedia | null;
  posterImage: StrapiMedia | null;
};


// ---------- Shared helper: call any Strapi endpoint ----------
async function fetchFromStrapi(path: string) {
  const res = await fetch(`${STRAPI_URL}${path}`);

  if (!res.ok) {
    throw new Error(`Strapi request to ${path} failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data; 
}

// ---------- Specs Section ----------
export async function getSpecsSection(): Promise<SpecsSectionData> {
  "use cache"; 
  cacheLife("minutes"); 

  const data: SpecsSectionData = await fetchFromStrapi(
    "/api/specs-section?populate[penImage]=true&populate[groups][populate][items]=true"
  );

  if (data.penImage) {
    data.penImage.url = getStrapiMedia(data.penImage.url);
  }

  return data;
}

// ---------- Manifesto Section ----------
export async function getManifestoSection(): Promise<ManifestoSectionData> {
  "use cache";
  cacheLife("minutes");

  const data = await fetchFromStrapi("/api/manifesto-section");

  return {
    statement: data.statement,
    audienceLabel: data.audienceLabel,
    audienceParagraphs: data.audienceText
      .split(/\n\s*\n/)
      .map((paragraph: string) => paragraph.trim())
      .filter(Boolean), // drop empty pieces
  };
}

// ---------- Audience Section ----------
export async function getAudienceSection(): Promise<AudienceSectionData> {
  "use cache";
  cacheLife("minutes");

  const data: AudienceSectionData = await fetchFromStrapi("/api/audience-section?populate=*");

  if (data.showcaseVideo) {
    data.showcaseVideo.url = getStrapiMedia(data.showcaseVideo.url);
  }

  return data;
}

// ---------- Smart Paper Section ----------
export async function getSmartPaperSection(): Promise<SmartPaperSectionData> {
  "use cache";
  cacheLife("minutes");


  const data: SmartPaperSectionData = await fetchFromStrapi(
    "/api/smart-paper-section?populate[slides][populate]=image"
  );

  for (const slide of data.slides) {
    if (slide.image) slide.image.url = getStrapiMedia(slide.image.url);
  }

  return data;
}

// ---------- Inside Box Section ----------
export async function getInsideBoxSection(): Promise<InsideBoxSectionData> {
  "use cache";
  cacheLife("minutes");


  const data: InsideBoxSectionData = await fetchFromStrapi("/api/inside-box-section?populate=*");

  if (data.boxImage) {
    data.boxImage.url = getStrapiMedia(data.boxImage.url);
  }

  return data;
}

// ---------- Details Section ----------
export async function getDetailsSection(): Promise<DetailsSectionData> {
  "use cache";
  cacheLife("minutes");


  const data: DetailsSectionData = await fetchFromStrapi(
    "/api/details-section?populate[featureTiles][populate]=*&populate[galleryTiles][populate]=*"
  );

  for (const tile of data.featureTiles) {
    if (tile.image) tile.image.url = getStrapiMedia(tile.image.url);
    if (tile.hoverImage) tile.hoverImage.url = getStrapiMedia(tile.hoverImage.url);
  }
  for (const tile of data.galleryTiles) {
    if (tile.media) tile.media.url = getStrapiMedia(tile.media.url);
  }

  return data;
}

// ---------- Colors Section ----------
export async function getColorsSection(): Promise<ColorsSectionData> {
  "use cache";
  cacheLife("minutes");

  const data: ColorsSectionData = await fetchFromStrapi(
    "/api/colors-section?populate[slides][populate]=penImage"
  );

  for (const slide of data.slides) {
    if (slide.penImage) slide.penImage.url = getStrapiMedia(slide.penImage.url);
  }

  return data;
}

// ---------- Footer ----------
export async function getFooter(): Promise<FooterData> {
  "use cache";
  cacheLife("minutes");


  return fetchFromStrapi("/api/footer?populate=*");
}

export async function getMainNav(): Promise<MainNavData> {
  "use cache";
  cacheLife("minutes");

  const data: MainNavData = await fetchFromStrapi("/api/main-n-av?populate=*");

  if (data.logo) data.logo.url = getStrapiMedia(data.logo.url);
  if (data.brandMark) data.brandMark.url = getStrapiMedia(data.brandMark.url);

  return data;
}

export async function getHeroSection(): Promise<HeroSectionData> {
  "use cache";
  cacheLife("minutes");

  const data: HeroSectionData = await fetchFromStrapi("/api/hero-section?populate=*");

  if (data.heroVideo) data.heroVideo.url = getStrapiMedia(data.heroVideo.url);
  if (data.posterImage) data.posterImage.url = getStrapiMedia(data.posterImage.url);

  return data;
}

function getStrapiMedia(url: string): string {
  if (url.startsWith("http")) return url; 
  return `${STRAPI_URL}${url}`;
}



// Fields of the "Popup" single type in Strapi
export type NotifyPopupData = {
  heading: string;
  text: string;
  emailPlaceholder: string;
  buttonLabel: string;
  closeLabel: string;
  successMessage: string;
  duplicateMessage: string;
};

export async function getNotifyPopup(): Promise<NotifyPopupData> {
  "use cache";
  cacheLife("minutes");
  return fetchFromStrapi("/api/popup");
}



export async function getGlobal(): Promise<GlobalData> {
  "use cache";
  cacheLife("minutes");
  const data: GlobalData = await fetchFromStrapi("/api/global?populate[seo][populate]=shareImage");
  if (data.seo?.shareImage) data.seo.shareImage.url = getStrapiMedia(data.seo.shareImage.url);
  return data;
}