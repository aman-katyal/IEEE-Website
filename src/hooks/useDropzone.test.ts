import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDropzone } from "./useDropzone";

describe("useDropzone", () => {
  it("initializes with default state", () => {
    const { result } = renderHook(() => useDropzone());
    expect(result.current.isDragging).toBe(false);
    expect(result.current.files).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("handles dragover and dragleave", () => {
    const { result } = renderHook(() => useDropzone());
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as React.DragEvent;

    act(() => {
      result.current.getRootProps().onDragOver(mockEvent);
    });
    expect(result.current.isDragging).toBe(true);

    act(() => {
      result.current.getRootProps().onDragLeave(mockEvent);
    });
    expect(result.current.isDragging).toBe(false);
  });

  it("validates accepted file types", () => {
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useDropzone({ accept: ["image/png"], onError })
    );

    const pdfFile = new File(["dummy"], "doc.pdf", { type: "application/pdf" });
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files: [pdfFile] },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.getRootProps().onDrop(mockEvent);
    });

    expect(result.current.error).toContain("Invalid file type");
    expect(onError).toHaveBeenCalled();
    expect(result.current.files).toHaveLength(0);
  });

  it("accepts valid dropped files", () => {
    const onDrop = vi.fn();
    const { result } = renderHook(() =>
      useDropzone({ accept: ["image/png"], onDrop })
    );

    const pngFile = new File(["dummy"], "photo.png", { type: "image/png" });
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files: [pngFile] },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.getRootProps().onDrop(mockEvent);
    });

    expect(result.current.files).toHaveLength(1);
    expect(result.current.error).toBeNull();
    expect(onDrop).toHaveBeenCalledWith([pngFile]);
  });
});
