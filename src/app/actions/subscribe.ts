"use server"; // everything in this file runs ONLY on the server, never in the browser

export type SubscribeState = {
  status: "idle" | "success" | "duplicate" | "invalid" | "error";
};

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";


export async function subscribe(_prevState: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();


  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "invalid" };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: { email } }),
      cache: "no-store", // never cache a "save" request
    });

    if (res.ok) return { status: "success" };

  
    const json = await res.json().catch(() => null);
    const message: string = json?.error?.message ?? "";

    if (message.includes("unique")) return { status: "duplicate" };
    if (message.includes("valid email")) return { status: "invalid" };

    console.error("Subscribe failed:", res.status, message); 
    return { status: "error" };
  } catch (error) {
    console.error("Subscribe failed: Strapi not reachable", error);
    return { status: "error" };
  }
}
