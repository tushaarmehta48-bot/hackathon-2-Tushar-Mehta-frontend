"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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

const HERO_ASPECT = 21 / 9;

type EventDetailHeroFieldProps = {
  heroImageUrl?: string;
  onChange: (url: string | undefined) => void;
};

export function EventDetailHeroField({
  heroImageUrl,
  onChange,
}: EventDetailHeroFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState("");

  function openCropForFile(file: File) {
    setCropFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCropSrc(String(reader.result));
    reader.onerror = () => setError("Could not read image file.");
    reader.readAsDataURL(file);
  }

  async function uploadCroppedFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { url } = await adminUploadEventBanner(
        normalizeImageUploadFile(file, "event-hero.jpg"),
      );
      onChange(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function removeHero() {
    const url = heroImageUrl?.trim();
    if (!url) return;
    setDeleting(true);
    setError(null);
    try {
      if (isHostedEventPulseImage(url)) {
        await adminDeleteUploadedEventImage(url);
      }
      onChange(undefined);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove image.");
    } finally {
      setDeleting(false);
    }
  }

  function addUrl() {
    const next = urlDraft.trim();
    if (!next) return;
    onChange(next);
    setUrlDraft("");
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-border bg-bg-milk p-4">
      <div>
        <p className="text-sm font-semibold text-ink">Event page hero</p>
        <p className="text-xs text-ink-muted">
          Shown at the top when guests click View event (21:9 wide banner).
          Separate from listing card images.
        </p>
      </div>

      {heroImageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
          <div className="flex items-center justify-between bg-surface-muted px-3 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Detail hero
            </span>
            <button
              type="button"
              aria-label="Remove hero image"
              disabled={deleting}
              className="flex h-8 w-8 items-center justify-center rounded-full text-danger transition hover:bg-danger/10 disabled:opacity-50"
              onClick={() => void removeHero()}
            >
              <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="relative aspect-[21/9] w-full bg-surface-muted">
            <Image
              src={heroImageUrl}
              alt="Event detail hero preview"
              fill
              className="object-cover object-center"
              sizes="(max-width:768px) 100vw, 640px"
              unoptimized={heroImageUrl.startsWith("http://localhost")}
            />
          </div>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) openCropForFile(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      <Button
        type="button"
        variant="secondary"
        loading={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {heroImageUrl ? "Replace hero image" : "Upload hero image"}
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Input
          label="Or paste image URL"
          type="url"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          className="sm:mb-0.5"
          disabled={!urlDraft.trim()}
          onClick={addUrl}
        >
          Set URL
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <AdminImageCropDialog
        open={cropSrc != null}
        imageSrc={cropSrc ?? ""}
        fileName={cropFileName}
        onClose={() => setCropSrc(null)}
        onCropped={(file) => void uploadCroppedFile(file)}
        aspect={HERO_ASPECT}
        exportMaxWidth={1920}
        title="Fit detail page hero"
        description="Wide 21:9 frame for the event page header (~1920×823)."
      />
    </div>
  );
}
