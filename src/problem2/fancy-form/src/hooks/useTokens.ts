import { useEffect, useState } from "react";
import { PRICE_API, TOKEN_ICON_BASE } from "../constants";
import type { Token, TokenPrice } from "../interfaces";
import DEFAULT_ICON from "../assets/default-token.svg";

async function ensureIcon(url: string): Promise<string> {
  try {
    const res = await fetch(url);

    // If HTTP is not OK => 404
    if (!res.ok) return DEFAULT_ICON;

    const text = await res.text();

    // Check if it is a real svg
    if (text.trim().startsWith("<svg")) {
      return url; // ICON OK
    }

    // If return HTML => 404
    if (text.includes("<!DOCTYPE html") || text.includes("<html")) {
      return DEFAULT_ICON;
    }

    return DEFAULT_ICON;
  } catch {
    return DEFAULT_ICON;
  }
}

async function extractDominantColorFromSvg(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const svg = await res.text();

    // 1) find all hex from fill=""
    const fillMatches = [...svg.matchAll(/fill="(#[0-9A-Fa-f]{3,8})"/g)];
    if (fillMatches.length > 0 && fillMatches[0][1] !== "none") {
      return fillMatches[0][1];
    }

    // 2) find stroke=""
    const strokeMatches = [...svg.matchAll(/stroke="(#[0-9A-Fa-f]{3,8})"/g)];
    if (strokeMatches.length > 0) {
      return strokeMatches[0][1];
    }

    // 3) style fill: #xxxxxx
    const styleFillMatches = [...svg.matchAll(/fill:\s*(#[0-9A-Fa-f]{3,8})/g)];
    if (styleFillMatches.length > 0) {
      return styleFillMatches[0][1];
    }

    // 4) style stroke: #xxxxxx
    const styleStrokeMatches = [
      ...svg.matchAll(/stroke:\s*(#[0-9A-Fa-f]{3,8})/g),
    ];
    if (styleStrokeMatches.length > 0) {
      return styleStrokeMatches[0][1];
    }

    // ⭐ 5) stop-color (gradient)
    const stopColorMatches = [
      ...svg.matchAll(/stop-color="(#[0-9A-Fa-f]{3,8})"/g),
    ];
    if (stopColorMatches.length > 0) {
      return stopColorMatches[0][1];
    }

    const stopColorStyle = [
      ...svg.matchAll(/stop-color:\s*(#[0-9A-Fa-f]{3,8})/g),
    ];
    if (stopColorStyle.length > 0) {
      return stopColorStyle[0][1];
    }

    // 6) rgb() fallback
    const rgbFillMatches = [...svg.matchAll(/fill="(rgb\([^)]+\))"/g)];
    if (rgbFillMatches.length > 0) {
      return rgbFillMatches[0][1];
    }

    const rgbStrokeMatches = [...svg.matchAll(/stroke="(rgb\([^)]+\))"/g)];
    if (rgbStrokeMatches.length > 0) {
      return rgbStrokeMatches[0][1];
    }

    const rgbStopMatches = [...svg.matchAll(/stop-color="(rgb\([^)]+\))"/g)];
    if (rgbStopMatches.length > 0) {
      return rgbStopMatches[0][1];
    }
  } catch (e) {
    console.warn("SVG dominant color extraction failed:", e);
  }

  // fallback
  return "#30363d";
}

const useTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(PRICE_API);
        const data = await res.json();

        // map API → raw tokens
        const mapped: Token[] = data.map((tokenPrice: TokenPrice) => ({
          symbol: tokenPrice.currency,
          price: tokenPrice.price,
          image: `${TOKEN_ICON_BASE}/${tokenPrice.currency}.svg`,
        }));

        // remove duplicates
        const unique = Array.from(
          new Map(mapped.map((t) => [t.symbol, t])).values()
        );

        // get dominant color for each SVG
        const finalList = await Promise.all(
          unique.map(async (t) => {
            const safeImage = await ensureIcon(t.image);
            const dominantColor = await extractDominantColorFromSvg(safeImage);

            return {
              ...t,
              image: safeImage,
              dominantColor,
            };
          })
        );

        await new Promise((r) => setTimeout(r, 2000)); // artificial delay

        setTokens(finalList);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { tokens, loading };
};

export default useTokens;
