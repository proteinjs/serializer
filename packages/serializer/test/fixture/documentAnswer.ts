/**
 * A document-shaped service answer, generated: a root with `rowCount` rows, each a paragraph of
 * text in several scripts with quotes, a backslash and a line break, a few fields, tags, a child
 * list and nested settings — plus the type catalogs an editor's open carries beside the rows. The
 * shape of a large document a service returns whole on every open, for suites that pin the wire
 * form's bytes and round trip; never a real document.
 */
export type DocumentAnswerRow = {
  id: string;
  index: number;
  parent: string | null;
  type: string;
  text: string;
  tags: string[];
  children: string[];
  depth: number;
  done: boolean;
  updatedAt: number;
  settings: { collapsed: boolean; width: number | null; ratio: number };
  marks: { bold: number[]; links: { href: string; title: string }[] };
  facts: { createdBy: string; createdAt: number; updatedBy: string; revision: number };
  layout: { x: number; y: number; w: number; h: number };
};

export type DocumentAnswer = {
  id: string;
  title: string;
  version: number;
  rows: DocumentAnswerRow[];
  catalogs: {
    types: {
      id: string;
      name: string;
      glyph: string;
      fields: {
        name: string;
        kind: string;
        required: boolean;
        default: string | number | boolean | null;
        options: { min: number; max: number; step: number };
        labels: string[];
      }[];
    }[];
    grants: { typeId: string; read: boolean; write: boolean; share: boolean; by: { role: string; since: number } }[];
  };
};

const PARAGRAPH =
  'The quick brown fox jumps over the lazy dog, then writes a note about it: “naïve”, résumé, ' +
  'Ångström, 日本語, a check ✓ and a globe 🌍 — with a "double quote", a backslash \\ and a\nline break. ';

export function documentAnswer(rowCount = 600): DocumentAnswer {
  return {
    id: 'document-root',
    title: 'A large document',
    version: 7,
    rows: Array.from({ length: rowCount }, (_, i) => ({
      id: `row-${i}`,
      index: i,
      parent: i === 0 ? null : `row-${Math.floor((i - 1) / 3)}`,
      type: `type-${i % 24}`,
      text: i % 3 === 0 ? PARAGRAPH.repeat(2) : PARAGRAPH,
      tags: ['alpha', 'beta', `tag-${i % 11}`],
      children: [`row-${3 * i + 1}`, `row-${3 * i + 2}`, `row-${3 * i + 3}`],
      depth: Math.floor(Math.log(2 * i + 1) / Math.log(3)),
      done: i % 2 === 0,
      updatedAt: 1_700_000_000_000 + i * 1000,
      settings: { collapsed: i % 7 === 0, width: i % 3 === 0 ? null : 320 + (i % 5) * 40, ratio: i / 7 },
      marks: {
        bold: [i % 13, (i % 13) + 4],
        links: [{ href: `https://example.test/${i}`, title: `Link ${i}` }],
      },
      facts: {
        createdBy: `person-${i % 4}`,
        createdAt: 1_690_000_000_000 + i * 500,
        updatedBy: 'person-1',
        revision: i % 9,
      },
      layout: { x: i % 12, y: Math.floor(i / 12), w: 1 + (i % 3), h: 1 },
    })),
    catalogs: {
      types: Array.from({ length: 48 }, (_, i) => ({
        id: `type-${i}`,
        name: `Type ${i}`,
        glyph: 'ᚠ',
        fields: Array.from({ length: 16 }, (_, f) => ({
          name: `field-${f}`,
          kind: ['text', 'number', 'flag', 'link'][f % 4],
          required: f < 2,
          default: [null, 0, false, 'none'][f % 4],
          options: { min: 0, max: 10 * (f + 1), step: 1 },
          labels: ['a', 'b'],
        })),
      })),
      grants: Array.from({ length: 48 }, (_, i) => ({
        typeId: `type-${i}`,
        read: true,
        write: i % 2 === 0,
        share: false,
        by: { role: 'owner', since: 1_690_000_000_000 },
      })),
    },
  };
}
