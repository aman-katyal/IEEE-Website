import { useState, useCallback, useRef } from "react";

export interface DropzoneOptions {
  accept?: string[]; // e.g. ['image/png', 'image/jpeg', 'application/pdf']
  maxSizeBytes?: number;
  multiple?: boolean;
  onDrop?: (files: File[]) => void;
  onError?: (error: string) => void;
}

export interface UseDropzoneResult {
  isDragging: boolean;
  files: File[];
  error: string | null;
  getRootProps: () => {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  getInputProps: () => {
    ref: React.RefObject<HTMLInputElement | null>;
    type: "file";
    accept: string | undefined;
    multiple: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  openFileDialog: () => void;
  clearFiles: () => void;
}

export function useDropzone(options: DropzoneOptions = {}): UseDropzoneResult {
  const {
    accept,
    maxSizeBytes,
    multiple = false,
    onDrop: onDropCallback,
    onError: onErrorCallback,
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (fileList: File[]): File[] => {
      setError(null);

      let selected = multiple ? fileList : fileList.slice(0, 1);

      if (accept && accept.length > 0) {
        const invalid = selected.filter(
          (f) =>
            !accept.some((type) => {
              if (type.endsWith("/*")) {
                const prefix = type.replace("/*", "");
                return f.type.startsWith(prefix);
              }
              return f.type === type;
            })
        );
        if (invalid.length > 0) {
          const msg = `Invalid file type: ${invalid.map((f) => f.name).join(", ")}. Accepted: ${accept.join(", ")}`;
          setError(msg);
          onErrorCallback?.(msg);
          return [];
        }
      }

      if (maxSizeBytes) {
        const oversized = selected.filter((f) => f.size > maxSizeBytes);
        if (oversized.length > 0) {
          const msg = `File exceeds max size: ${oversized.map((f) => f.name).join(", ")}`;
          setError(msg);
          onErrorCallback?.(msg);
          return [];
        }
      }

      return selected;
    },
    [accept, maxSizeBytes, multiple, onErrorCallback]
  );

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const valid = validateFiles(newFiles);
      if (valid.length > 0) {
        setFiles(valid);
        onDropCallback?.(valid);
      }
    },
    [validateFiles, onDropCallback]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      handleFiles(dropped);
    },
    [handleFiles]
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(selected);
    },
    [handleFiles]
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return {
    isDragging,
    files,
    error,
    getRootProps: () => ({ onDragOver, onDragLeave, onDrop }),
    getInputProps: () => ({
      ref: inputRef,
      type: "file",
      accept: accept?.join(","),
      multiple,
      onChange,
    }),
    openFileDialog,
    clearFiles,
  };
}
