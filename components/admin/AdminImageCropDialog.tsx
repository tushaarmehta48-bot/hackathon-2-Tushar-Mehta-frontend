"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/Button";
import {
  blobToFile,
  cropImageToJpegBlob,
} from "@/lib/images/crop-image";

type AdminImageCropDialogProps = {
  open: boolean;
  imageSrc: string;
  fileName: string;
  onClose: () => void;
  onCropped: (file: File) => void;
  aspect?: number;
  title?: string;
  description?: string;
  exportMaxWidth?: number;
};

export function AdminImageCropDialog({
  open,
  imageSrc,
  fileName,
  onClose,
  onCropped,
  aspect = 16 / 10,
  title = "Fit image to event card",
  description = "Drag and zoom to fit the frame. We resize for listings.",
  exportMaxWidth = 1280,
}: AdminImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function applyCrop() {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await cropImageToJpegBlob(imageSrc, croppedAreaPixels, {
        maxWidth: exportMaxWidth,
        aspect,
      });
      const base = fileName.replace(/\.[^.]+$/, "") || "event-image";
      onCropped(blobToFile(blob, `${base}.jpg`));
      onClose();
    } catch {
      setError("Could not crop image. Try another file.");
    } finally {
      setProcessing(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-dialog-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated">
        <div className="border-b border-border px-5 py-4">
          <h2 id="crop-dialog-title" className="font-display text-lg font-semibold text-ink">
            {title}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
        </div>

        <div className="relative h-[min(50vh,320px)] bg-ink">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-3 border-t border-border px-5 py-4">
          <label className="flex items-center gap-3 text-sm text-ink-muted">
            <span className="shrink-0">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>
          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={processing}>
              Cancel
            </Button>
            <Button type="button" loading={processing} onClick={() => void applyCrop()}>
              Use cropped image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
