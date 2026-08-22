import { describe, it, expect } from "vitest";
import { schemaTypes } from "../../studio/schema/index";

describe("Sanity Studio Schema Registry Contract", () => {
  it("exports a non-empty array of schemas", () => {
    expect(Array.isArray(schemaTypes)).toBe(true);
    expect(schemaTypes.length).toBeGreaterThan(10);
  });

  it("contains unique schema type names across all documents and objects", () => {
    const names = schemaTypes.map((s) => s.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("ensures all schema types have valid name, title, and type properties", () => {
    for (const schema of schemaTypes) {
      expect(schema.name).toBeDefined();
      expect(typeof schema.name).toBe("string");
      expect(schema.name.length).toBeGreaterThan(0);

      expect(schema.title).toBeDefined();
      expect(typeof schema.title).toBe("string");

      expect(schema.type).toBeDefined();
      expect(typeof schema.type).toBe("string");
    }
  });

  it("ensures all document schemas contain valid fields", () => {
    const docSchemas = schemaTypes.filter((s) => s.type === "document");
    expect(docSchemas.length).toBeGreaterThan(5);

    for (const doc of docSchemas) {
      expect((doc as any).fields).toBeDefined();
      expect(Array.isArray((doc as any).fields)).toBe(true);
      expect((doc as any).fields.length).toBeGreaterThan(0);
    }
  });
});
