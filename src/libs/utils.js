export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function getCurrentYear() {
  return new Date().getFullYear();
}

import { getImage } from "astro:assets";
export async function getOptimizedImage(image, options = {}) {
  const sourceWidth = typeof image === "object" && image?.width ? image.width : 1600;
  const requestedWidths = options.widths ?? [640, 960, 1600];
  const widths = [...new Set(
    requestedWidths
      .map((width) => Math.min(width, sourceWidth))
      .filter((width) => width > 0)
  )].sort((a, b) => a - b);

  const variants = await Promise.all(widths.map((width) => getImage({
    src: image,
    width,
    format: "webp",
    quality: options.quality ?? 72,
  })));
  const optimizedImage = variants.at(-1);

  return {
    ...optimizedImage,
    srcSet: variants.map((variant, index) => `${variant.src} ${widths[index]}w`).join(", "),
    sizes: options.sizes ?? "100vw",
  };
}

// Learn more agout the getImage() function here
// https://docs.astro.build/en/guides/images/#generating-images-with-getimage
