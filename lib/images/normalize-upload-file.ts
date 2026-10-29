const ALLOWED_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Ensures multer receives a recognizable image MIME type and filename. */
export function normalizeImageUploadFile(
  file: File,
  fallbackName = "event-image.jpg",
): File {
  const name = ALLOWED_EXT.test(file.name) ? file.name : fallbackName;
  const type =
    file.type && /^image\/(jpe?g|png|webp|gif)$/i.test(file.type)
      ? file.type
      : name.toLowerCase().endsWith(".png")
        ? "image/png"
        : name.toLowerCase().endsWith(".webp")
          ? "image/webp"
          : name.toLowerCase().endsWith(".gif")
            ? "image/gif"
            : "image/jpeg";

  if (file.name === name && file.type === type) {
    return file;
  }
  return new File([file], name, { type, lastModified: file.lastModified });
}
