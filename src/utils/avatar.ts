export interface SquareCropRect {
  sx: number;
  sy: number;
  sSize: number;
}

export interface AvatarValidationResult {
  valid: boolean;
  error?: string;
}

const DEFAULT_MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB before compression

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'PK';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function calculateSquareCropRect(
  width: number,
  height: number
): SquareCropRect {
  const safeWidth = Math.max(1, Math.floor(width));
  const safeHeight = Math.max(1, Math.floor(height));
  const sSize = Math.min(safeWidth, safeHeight);
  const sx = Math.floor((safeWidth - sSize) / 2);
  const sy = Math.floor((safeHeight - sSize) / 2);
  return { sx, sy, sSize };
}

export function validateAvatarFile(
  file: { type?: string; size?: number },
  maxBytes = DEFAULT_MAX_FILE_BYTES
): AvatarValidationResult {
  const mime = (file.type ?? '').toLowerCase();
  if (!mime.startsWith('image/')) {
    return {
      valid: false,
      error: 'Pilih file gambar (JPG, PNG, atau WebP).',
    };
  }

  if (typeof file.size === 'number' && file.size > maxBytes) {
    return {
      valid: false,
      error: 'Ukuran foto terlalu besar (maksimal 15 MB).',
    };
  }

  return { valid: true };
}

export function sanitizeAvatarDataUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed.startsWith('data:image/')) return undefined;
  if (trimmed.length > 500_000) return undefined;
  return trimmed;
}

export async function compressImageToAvatarDataUrl(
  file: File,
  targetSize = 192
): Promise<string> {
  const validation = validateAvatarFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'File gambar tidak valid.');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Gagal membaca file gambar.'));
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Format gambar tidak didukung browser.'));
    image.src = dataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Browser tidak mendukung pemrosesan gambar.');
  }

  const { sx, sy, sSize } = calculateSquareCropRect(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height
  );

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetSize, targetSize);
  ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, targetSize, targetSize);

  return canvas.toDataURL('image/jpeg', 0.85);
}
