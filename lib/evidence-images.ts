export const MAX_EVIDENCE_IMAGES = 5;
export const MAX_SOURCE_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_EVIDENCE_DIMENSION = 1600;
export const EVIDENCE_JPEG_QUALITY = 0.76;

export class EvidenceImageError extends Error { constructor(public code: "type" | "size" | "count" | "decode", message: string) { super(message); this.name = "EvidenceImageError"; } }

export function validateEvidenceSelection(files: File[], existingCount = 0) {
  if (existingCount + files.length > MAX_EVIDENCE_IMAGES) throw new EvidenceImageError("count", "Maximum 5 evidence images allowed.");
  for (const file of files) {
    if (!file.type.startsWith("image/")) throw new EvidenceImageError("type", "Only image files can be uploaded as evidence.");
    if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new EvidenceImageError("size", "Image is too large. Please upload an image smaller than 8 MB.");
  }
}

function readFile(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new EvidenceImageError("decode", "Unable to read this image.")); reader.onerror = () => reject(new EvidenceImageError("decode", "Unable to read this image.")); reader.readAsDataURL(file); }); }
function decodeImage(src: string) { return new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new EvidenceImageError("decode", "Unable to process this image.")); image.src = src; }); }

export function getNormalizedImageDimensions(width: number, height: number, maxDimension = MAX_EVIDENCE_DIMENSION) {
  const scale = Math.min(1, maxDimension / width, maxDimension / height);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function normalizedEvidenceDataUrl(canvas: HTMLCanvasElement, quality = EVIDENCE_JPEG_QUALITY) {
  const dimensions = getNormalizedImageDimensions(canvas.width, canvas.height);
  if (dimensions.width === canvas.width && dimensions.height === canvas.height) return canvas.toDataURL("image/jpeg", quality);
  const normalized = document.createElement("canvas"); normalized.width = dimensions.width; normalized.height = dimensions.height;
  const context = normalized.getContext("2d"); if (!context) throw new EvidenceImageError("decode", "Image processing is unavailable in this browser.");
  context.drawImage(canvas, 0, 0, normalized.width, normalized.height);
  return normalized.toDataURL("image/jpeg", quality);
}

export async function optimizeEvidenceImage(file: File) {
  validateEvidenceSelection([file]);
  const source = await readFile(file); const image = await decodeImage(source);
  const dimensions = getNormalizedImageDimensions(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement("canvas"); canvas.width = dimensions.width; canvas.height = dimensions.height;
  const context = canvas.getContext("2d"); if (!context) throw new EvidenceImageError("decode", "Image processing is unavailable in this browser.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const dataUrl = normalizedEvidenceDataUrl(canvas);
  return { dataUrl, size: Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75), width: canvas.width, height: canvas.height, originalSize: file.size };
}
