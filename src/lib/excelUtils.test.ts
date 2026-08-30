import { describe, it, expect, vi, afterEach } from "vitest";
import { exportToExcelXml } from "./excelUtils";

describe("exportToExcelXml", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates correct xml format", () => {
    const mockCreateElement = vi.fn().mockReturnValue({
      href: "",
      download: "",
      click: vi.fn(),
      style: {},
    });
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();
    const mockCreateObjectURL = vi.fn().mockReturnValue("blob:test");
    const mockRevokeObjectURL = vi.fn();

    global.document.createElement = mockCreateElement as any;
    global.document.body.appendChild = mockAppendChild as any;
    global.document.body.removeChild = mockRemoveChild as any;
    global.URL.createObjectURL = mockCreateObjectURL as any;
    global.URL.revokeObjectURL = mockRevokeObjectURL as any;

    exportToExcelXml("test", [
      {
        name: "Sheet 1",
        headers: ["A", "B"],
        rows: [[1, "test & val"]],
      },
    ]);

    expect(mockCreateElement).toHaveBeenCalledWith("a");
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });
});
