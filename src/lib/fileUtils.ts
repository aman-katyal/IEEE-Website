/**
 * Formats a byte count to a human-readable string with appropriate unit.
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 0) return '0 Bytes';
  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const index = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, index)).toFixed(dm))} ${sizes[index]}`;
}

export type SupportedFileType = 'pdf' | 'png' | 'jpeg' | 'webp' | 'gif';

/**
 * Inspects initial bytes of a buffer to detect binary file signature.
 */
export function detectFileSignature(input: Uint8Array | ArrayBuffer): SupportedFileType | null {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.length < 4) return null;

  // PDF: %PDF (0x25 0x50 0x44 0x46)
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'pdf';
  }

  // PNG: 0x89 0x50 0x4E 0x47
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4E &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0D &&
    bytes[5] === 0x0A &&
    bytes[6] === 0x1A &&
    bytes[7] === 0x0A
  ) {
    return 'png';
  }

  // JPEG: 0xFF 0xD8 0xFF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return 'jpeg';
  }

  // GIF: GIF8 (0x47 0x49 0x46 0x38)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return 'gif';
  }

  // WEBP: RIFF....WEBP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'webp';
  }

  return null;
}

/**
 * Validates that a file's declared extension matches its actual binary magic bytes.
 */
export function validateFileExtensionMatch(filename: string, buffer: Uint8Array | ArrayBuffer): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return false;

  const detected = detectFileSignature(buffer);
  if (!detected) return false;

  if (ext === 'jpg' || ext === 'jpeg') return detected === 'jpeg';
  if (ext === 'png') return detected === 'png';
  if (ext === 'pdf') return detected === 'pdf';
  if (ext === 'webp') return detected === 'webp';
  if (ext === 'gif') return detected === 'gif';

  return false;
}
