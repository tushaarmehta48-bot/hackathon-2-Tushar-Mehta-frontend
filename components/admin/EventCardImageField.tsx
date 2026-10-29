"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ApiError } from "@/lib/api-client";
import {
  adminDeleteUploadedEventImage,
  adminUploadEventBanner,
} from "@/lib/api/admin";
import { isHostedEventPulseImage } from "@/lib/events/card-images";
import { normalizeImageUploadFile } from "@/lib/images/normalize-upload-file";
import { AdminImageCropDialog } from "@/components/admin/AdminImageCropDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const MAX_IMAGES = 12;

type EventCardImageFieldProps = {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
};

export function EventCardImageField({
  imageUrls,
  onChange,
}: EventCardImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState("");
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const imageUrlsRef = useRef(imageUrls);
  useEffect(() => {
    imageUrlsRef.current = imageUrls;
  }, [imageUrls]);

  function openCropForFile(file: File) {
    setCropFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(String(reader.result));
    reader.onerror = () => setError("Could not read image file.");
    reader.readAsDataURL(file);
  }

  function onFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    if (imageUrls.length >= MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images per event.`);
      return;
    }
    setError(null);
    const list = Array.from(files);
    const room = MAX_IMAGES - imageUrls.length;
    const batch = list.slice(0, room);
    if (batch.length === 0) return;
    setFileQueue(batch.slice(1));
    openCropForFile(batch[0]!);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadCroppedFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { url } = await adminUploadEventBanner(
        normalizeImageUploadFile(file, "event-card.jpg"),
      );
      onChange([...imageUrlsRef.current, url]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onCropDialogClose() {
    setCropSrc(null);
    if (fileQueue.length > 0) {
      const [next, ...rest] = fileQueue;
      setFileQueue(rest);
      if (next) openCropForFile(next);
    }
  }

  async function onCropped(file: File) {
    setCropSrc(null);
    await uploadCroppedFile(file);
    if (fileQueue.length > 0) {
      const [next, ...rest] = fileQueue;
      setFileQueue(rest);
      if (next && imageUrls.length + 1 < MAX_IMAGES) {
        openCropForFile(next);
      }
    }
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    if (imageUrls.length >= MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images per event.`);
      return;
    }
    if (imageUrls.includes(url)) {
      setError("That URL is already in the list.");
      return;
    }
    setError(null);
    onChange([...imageUrls, url]);
    setUrlDraft("");
  }

  async function removeImage(url: string) {
    setError(null);
    setDeletingUrl(url);
    try {
      if (isHostedEventPulseImage(url)) {
        await adminDeleteUploadedEventImage(url);
      }
      onChange(imageUrls.filter((u) => u !== url));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete image.");
    } finally {
      setDeletingUrl(null);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-border bg-bg-milk p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink">Event card images</p>
          <p className="text-xs text-ink-muted">
            Upload opens a 16:10 crop (same as public cards, ~1280×800). Preview
            below matches how images are cropped to width and height on the site.
            Up to {MAX_IMAGES} images; max 5 MB each after crop.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => void onFilesSelected(e.target.files)}
        />
        <Button
          type="button"
          variant="secondary"
          loading={uploading}
          disabled={imageUrls.length >= MAX_IMAGES}
          onClick={() => inputRef.current?.click()}
        >
          Upload images
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Input
          label="Add image URL"
          name="cardImageUrlDraft"
          type="url"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          className="sm:mb-0.5"
          disabled={!urlDraft.trim() || imageUrls.length >= MAX_IMAGES}
          onClick={addUrl}
        >
          Add URL
        </Button>
      </div>

      {imageUrls.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {imageUrls.map((url, index) => (
            <li
              key={url}
              className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft"
            >
              <div className="flex items-center justify-between bg-surface-muted px-3 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Card {index + 1}
                </span>
                <button
                  type="button"
                  aria-label={`Delete image ${index + 1}`}
                  disabled={deletingUrl === url}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-danger transition hover:bg-danger/10 disabled:opacity-50"
                  onClick={() => void removeImage(url)}
                >
                  <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="relative aspect-[16/10] w-full bg-surface-muted">
                <Image
                  src={url}
                  alt={`Card image ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="240px"
                  unoptimized={url.startsWith("http://localhost")}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-ink-muted">No card images yet.</p>
      )}

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <AdminImageCropDialog
        open={cropSrc != null}
        imageSrc={cropSrc ?? ""}
        fileName={cropFileName}
        onClose={onCropDialogClose}
        onCropped={(file) => void onCropped(file)}
      />
    </div>
  );
}
