/**
 * Academic Citation Generator for Purdue IEEE papers and technical reports.
 * Supports IEEE Standard, Markdown, and BibTeX citation formatting.
 */

export interface PaperMetadata {
  title: string;
  authors: string[];
  conferenceOrJournal: string;
  year: number;
  doi?: string;
  url?: string;
  pages?: string;
  volume?: string;
}

/**
 * Formats paper citation in standard IEEE reference format:
 * [1] A. Author and B. Author, "Paper title," Journal/Conf, vol. X, pp. Y-Z, Year.
 */
export function formatIeeeCitation(paper: PaperMetadata, index = 1): string {
  const authorStr = paper.authors.join(", ");
  const parts = [
    `[${index}] ${authorStr}, "${paper.title},"`,
    `*${paper.conferenceOrJournal}*`,
  ];

  if (paper.volume) parts.push(`vol. ${paper.volume},`);
  if (paper.pages) parts.push(`pp. ${paper.pages},`);
  parts.push(`${paper.year}.`);
  if (paper.doi) parts.push(`DOI: ${paper.doi}`);

  return parts.join(" ");
}

/**
 * Formats paper citation in copyable Markdown format.
 */
export function formatMarkdownCitation(paper: PaperMetadata): string {
  const authorStr = paper.authors.join(", ");
  const linkStr = paper.url ? ` [[Link](${paper.url})]` : "";
  const doiStr = paper.doi ? ` [DOI: ${paper.doi}](https://doi.org/${paper.doi})` : "";

  return `> **${paper.title}**  \n> *${authorStr}* (${paper.year}). In *${paper.conferenceOrJournal}*.${doiStr}${linkStr}`;
}

/**
 * Formats paper citation in BibTeX format.
 */
export function formatBibtexCitation(paper: PaperMetadata): string {
  const firstAuthorLast = (paper.authors[0] || "purdueieee").split(" ").pop()?.toLowerCase() || "paper";
  const citeKey = `${firstAuthorLast}${paper.year}${paper.title.slice(0, 10).replace(/\W/g, "").toLowerCase()}`;

  const fields = [
    `  title = {${paper.title}}`,
    `  author = {${paper.authors.join(" and ")}}`,
    `  booktitle = {${paper.conferenceOrJournal}}`,
    `  year = {${paper.year}}`,
  ];

  if (paper.doi) fields.push(`  doi = {${paper.doi}}`);
  if (paper.url) fields.push(`  url = {${paper.url}}`);
  if (paper.pages) fields.push(`  pages = {${paper.pages}}`);

  return `@inproceedings{${citeKey},\n${fields.join(",\n")}\n}`;
}
