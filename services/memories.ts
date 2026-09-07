import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { Memory } from "@/lib/types";
import type { ApiMemory, ApiUploadUrlResponse } from "./dto";
import { mapMemory } from "./map";

interface UploadInput {
  file: File;
  caption?: string;
  location?: string;
  capturedAt?: string;
}

/**
 * `/api/v1/trips/{id}/memories`. Photo bytes never touch the backend: it hands back a
 * pre-signed upload URL, the browser PUTs straight to it, and only then is the file
 * registered (see backend/README.md §7.4).
 *
 * Not wired into a screen yet — the memory book renders what `GET /adventures` already
 * returns. Uploading needs the backend's storage migration finished first.
 */
export const memories = {
  async list(tripId: string, signal?: AbortSignal): Promise<Memory[]> {
    const rows = await apiGet<ApiMemory[]>(`/trips/${tripId}/memories`, undefined, signal);
    return rows.map(mapMemory);
  },

  async upload(tripId: string, { file, caption, location, capturedAt }: UploadInput): Promise<Memory> {
    const session = await apiPost<ApiUploadUrlResponse>(`/trips/${tripId}/memories/upload-url`, {
      filename: file.name,
      content_type: file.type || "application/octet-stream",
    });

    const uploaded = await fetch(session.upload_url, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!uploaded.ok) throw new Error(`Upload failed (${uploaded.status})`);

    const registered = await apiPost<ApiMemory>(`/trips/${tripId}/memories`, {
      s3_key: session.s3_key,
      caption: caption ?? null,
      location: location ?? null,
      captured_at: capturedAt ?? null,
    });
    return mapMemory(registered);
  },

  remove(tripId: string, memoryId: string): Promise<void> {
    return apiDelete(`/trips/${tripId}/memories/${memoryId}`);
  },
};
