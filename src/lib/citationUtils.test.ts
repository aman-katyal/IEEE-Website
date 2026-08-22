import { describe, it, expect } from "vitest";
import {
  formatIeeeCitation,
  formatMarkdownCitation,
  formatBibtexCitation,
  type PaperMetadata,
} from "./citationUtils";

describe("citationUtils Suite", () => {
  const paper: PaperMetadata = {
    title: "Autonomous Underwater Localization in Low-Visibility Turbid Environments",
    authors: ["Alex Vance", "Jordan Lee", "Taylor Smith"],
    conferenceOrJournal: "IEEE OCEANS 2026",
    year: 2026,
    doi: "10.1109/OCEANS.2026.123456",
    url: "https://ieeexplore.ieee.org/document/123456",
  };

  it("formats IEEE standard citation correctly", () => {
    const formatted = formatIeeeCitation(paper, 1);
    expect(formatted).toContain("[1] Alex Vance, Jordan Lee, Taylor Smith");
    expect(formatted).toContain('"Autonomous Underwater Localization in Low-Visibility Turbid Environments,"');
    expect(formatted).toContain("*IEEE OCEANS 2026*");
    expect(formatted).toContain("2026.");
  });

  it("formats Markdown copyable snippet with links", () => {
    const md = formatMarkdownCitation(paper);
    expect(md).toContain("**Autonomous Underwater Localization in Low-Visibility Turbid Environments**");
    expect(md).toContain("*Alex Vance, Jordan Lee, Taylor Smith* (2026)");
    expect(md).toContain("[DOI: 10.1109/OCEANS.2026.123456]");
  });

  it("formats valid BibTeX entry", () => {
    const bibtex = formatBibtexCitation(paper);
    expect(bibtex).toContain("@inproceedings{");
    expect(bibtex).toContain("title = {Autonomous Underwater Localization in Low-Visibility Turbid Environments}");
    expect(bibtex).toContain("author = {Alex Vance and Jordan Lee and Taylor Smith}");
    expect(bibtex).toContain("year = {2026}");
  });
});
