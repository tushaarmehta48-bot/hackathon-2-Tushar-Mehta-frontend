export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

export type CropExportOptions = {
  maxWidth?: number;
  aspect?: number;
};

/** Crop and resize to a target aspect (default 16:10 listing cards). */
export async function cropImageToJpegBlob(
  imageSrc: string,
  crop: CropArea,
  maxWidthOrOptions: number | CropExportOptions = 1280,
): Promise<Blob> {
  const options =
    typeof maxWidthOrOptions === "number"
      ? { maxWidth: maxWidthOrOptions, aspect: 16 / 10 }
      : {
          maxWidth: maxWidthOrOptions.maxWidth ?? 1280,
          aspect: maxWidthOrOptions.aspect ?? 16 / 10,
        };
  const { maxWidth, aspect } = options;
  const image = await loadImage(imageSrc);
  const outWidth = Math.min(maxWidth, Math.max(640, Math.round(crop.width)));
  const outHeight = Math.round(outWidth / aspect);

  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outWidth,
    outHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not export image"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.9,
    );
  });
}

export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}
