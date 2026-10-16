import moment from 'moment';
import { Graph, isInstanceOf } from '@proteinjs/util';
import { SourceRepository } from '@proteinjs/reflection';
import { CustomSerializer, Serializer } from '../src/Serializer';
import { documentAnswer } from './fixture/documentAnswer';

/**
 * The output contract of `Serializer.serialize`, pinned as OUTCOMES over every kind the serializer
 * carries: the bytes are compact JSON (no indentation anywhere in the text — the base's indented
 * form is the red), and `Serializer.deserialize` reads them back to a deep-equal value — plain
 * objects and nested arrays, strings with line breaks and several scripts, numbers to the edges of
 * what JSON carries, booleans, null and undefined, empty containers, the package's own third-party
 * kinds (a moment, a graph), and a class instance carrying its `__serializerId` marker whose
 * custom serializer is registered the way a built package registers one (through the reflection
 * source repository). The earlier indented form of the same value reads back to the same value, so
 * a reader built before the wire form went compact and a writer built after it agree.
 */

/**
 * The package's own kinds (a moment, a graph) are registered by the generated reflection index —
 * the registration the built package performs when an application imports it. `npm run build`
 * first, as the workspace does before it tests.
 */
import '../generated';

/** A class instance kind: the marker on the instance names the serializer that carries it. */
const LEDGER_ENTRY_SERIALIZER_ID = '@proteinjs/serializer/test/LedgerEntrySerializer';
/** The declaration's name in the source repository: `${packageName}/${name}`, as reflection derives it. */
const LEDGER_ENTRY_SERIALIZER_QUALIFIED_NAME = '@proteinjs/serializer/LedgerEntrySerializer';

class LedgerEntry {
  __serializerId = LEDGER_ENTRY_SERIALIZER_ID;
  constructor(
    public account: string,
    public amountCents: number,
    public postedAt: moment.Moment,
    public memo: string | null
  ) {}

  signed(): string {
    return `${this.account}:${this.amountCents}`;
  }
}

/**
 * The payload a custom serializer hands back is typed `SerializableObject`, whose values exclude
 * `null` and third-party kinds — the runtime carries both (a nested moment rides its own kind, a
 * null is JSON's), and a shipped custom serializer types such a field `any` too.
 */
type SerializedLedgerEntry = { account: string; amountCents: number; postedAt: any; memo: any };

class LedgerEntrySerializer implements CustomSerializer {
  id = LEDGER_ENTRY_SERIALIZER_ID;

  serialize(entry: LedgerEntry): SerializedLedgerEntry {
    return { account: entry.account, amountCents: entry.amountCents, postedAt: entry.postedAt, memo: entry.memo };
  }

  deserialize(serialized: SerializedLedgerEntry): LedgerEntry {
    return new LedgerEntry(serialized.account, serialized.amountCents, serialized.postedAt, serialized.memo);
  }
}

/**
 * Registers the kind as a built package's generated index does: a class node implementing
 * `@proteinjs/serializer/CustomSerializer` merged into the source repository with its source link.
 * Before the first serialization — the serializer reads its registry once and holds it.
 */
const CUSTOM_SERIALIZER_QUALIFIED_NAME = '@proteinjs/serializer/CustomSerializer';
SourceRepository.merge(
  JSON.stringify({
    options: { directed: true, multigraph: false, compound: false },
    nodes: [
      {
        v: LEDGER_ENTRY_SERIALIZER_QUALIFIED_NAME,
        value: {
          packageName: '@proteinjs/serializer',
          name: 'LedgerEntrySerializer',
          filePath: 'test/SerializerOutputContract.test.ts',
          qualifiedName: LEDGER_ENTRY_SERIALIZER_QUALIFIED_NAME,
          isAbstract: false,
          isStatic: false,
          visibility: 'public',
          properties: [],
          methods: [],
          typeParameters: [],
          directParentInterfaces: [
            {
              packageName: '@proteinjs/serializer',
              name: 'CustomSerializer',
              filePath: null,
              qualifiedName: CUSTOM_SERIALIZER_QUALIFIED_NAME,
              properties: [],
              methods: [],
              typeParameters: [],
              directParents: [],
            },
          ],
          directParentClasses: [],
          sourceType: 2,
        },
      },
    ],
    edges: [
      { v: LEDGER_ENTRY_SERIALIZER_QUALIFIED_NAME, w: CUSTOM_SERIALIZER_QUALIFIED_NAME, value: 'implements interface' },
    ],
  }),
  { [LEDGER_ENTRY_SERIALIZER_QUALIFIED_NAME]: LedgerEntrySerializer }
);

/** The indented form the serializer wrote before the wire form went compact: the same JSON, re-indented. */
const indented = (compact: string) => JSON.stringify(JSON.parse(compact), null, 2);

/** True when the text carries indentation: a line break followed by spaces, outside any string. */
const carriesIndentation = (text: string) => /\n +/.test(text.replace(/"(?:[^"\\]|\\.)*"/g, '""'));

/** A graph with labels of every shape a label takes: none, a scalar, an object. */
const aGraph = () => {
  const graph = new Graph({ directed: true, multigraph: false, compound: false });
  graph.setGraph({ name: 'g', weight: 1.5 });
  graph.setNode('a', { label: 'A — “a”', depth: 0 });
  graph.setNode('b', 'B');
  graph.setNode('c');
  graph.setEdge('a', 'b', { kind: 'child', order: [1, 2, [3]] });
  graph.setEdge('b', 'c');
  return graph;
};

/** One value of every kind the serializer carries, nested the way an answer nests them. */
const everyKind = () => ({
  text: 'plain',
  textWithBreaks: 'line one\nline two\r\n\ttabbed "quoted" \\ backslash',
  scripts: 'naïve résumé Ångström 日本語 한국어 العربية ✓ 🌍 𝔘𝔫𝔦𝔠𝔬𝔡𝔢',
  empty: '',
  numbers: {
    zero: 0,
    negative: -1.5,
    integer: 42,
    fraction: 0.1 + 0.2,
    maxSafe: Number.MAX_SAFE_INTEGER,
    minSafe: Number.MIN_SAFE_INTEGER,
    large: 1e21,
    largest: Number.MAX_VALUE,
    tiny: Number.MIN_VALUE,
    exponent: 6.02214076e23,
  },
  booleans: [true, false],
  nothing: null,
  nested: [[1, [2, [3, [4]]]], { a: [{ b: [{ c: null }] }] }],
  emptyContainers: { object: {}, array: [] as string[] },
  when: moment(1_700_000_000_000),
  whens: [moment(0), moment(1_700_000_000_000)],
  graph: aGraph(),
  entry: new LedgerEntry('cash', 12_345, moment(1_700_000_000_000), null),
  entries: [new LedgerEntry('rent', -250_000, moment(1_600_000_000_000), 'October\n— paid')],
  document: documentAnswer(3),
});

/** Deep equality for the composite: moments by instant, graphs by their JSON, instances by class + fields. */
const expectEveryKind = (read: ReturnType<typeof everyKind>, written: ReturnType<typeof everyKind>) => {
  const { when, whens, graph, entry, entries, ...plainRead } = read;
  const {
    when: whenWritten,
    whens: whensWritten,
    graph: graphWritten,
    entry: entryWritten,
    entries: entriesWritten,
    ...plainWritten
  } = written;
  expect(plainRead).toEqual(plainWritten);

  expect(moment.isMoment(when)).toBe(true);
  expect(when.valueOf()).toBe(whenWritten.valueOf());
  expect(whens.map((m) => moment.isMoment(m))).toEqual([true, true]);
  expect(whens.map((m) => m.valueOf())).toEqual(whensWritten.map((m) => m.valueOf()));

  expect(isInstanceOf(graph, Graph)).toBe(true);
  expect(graph.graph()).toEqual(graphWritten.graph());
  expect(graph.nodes().sort()).toEqual(graphWritten.nodes().sort());
  for (const node of graphWritten.nodes()) {
    expect(graph.node(node)).toEqual(graphWritten.node(node));
  }
  expect(graph.edges()).toEqual(graphWritten.edges());
  for (const edge of graphWritten.edges()) {
    expect(graph.edge(edge)).toEqual(graphWritten.edge(edge));
  }

  for (const [readEntry, writtenEntry] of [
    [entry, entryWritten],
    [entries[0], entriesWritten[0]],
  ]) {
    expect(readEntry).toBeInstanceOf(LedgerEntry);
    expect(readEntry.signed()).toBe(writtenEntry.signed());
    expect(readEntry.account).toBe(writtenEntry.account);
    expect(readEntry.amountCents).toBe(writtenEntry.amountCents);
    expect(readEntry.memo).toBe(writtenEntry.memo);
    expect(moment.isMoment(readEntry.postedAt)).toBe(true);
    expect(readEntry.postedAt.valueOf()).toBe(writtenEntry.postedAt.valueOf());
  }
};

describe('the output contract: compact bytes', () => {
  it('a 600-row document answer serializes with no indentation anywhere in the text', () => {
    const answer = documentAnswer(600);
    const serialized = Serializer.serialize(answer);
    expect(carriesIndentation(serialized)).toBe(false);
    expect(serialized).toBe(JSON.stringify(answer));
    // The indented form of the same bytes is what the serializer wrote before: at least half again the size.
    expect(Buffer.byteLength(serialized, 'utf8') * 1.5).toBeLessThan(Buffer.byteLength(indented(serialized), 'utf8'));
  });

  it('a value of every kind serializes with no indentation anywhere in the text', () => {
    const serialized = Serializer.serialize(everyKind());
    expect(carriesIndentation(serialized)).toBe(false);
    expect(serialized).toBe(JSON.stringify(JSON.parse(serialized)));
  });

  it('a class instance carries its marker and its fields, compact', () => {
    const entry = new LedgerEntry('cash', 1, moment(5), 'm');
    expect(Serializer.serialize(entry)).toBe(
      JSON.stringify({
        __serializerId: LEDGER_ENTRY_SERIALIZER_ID,
        account: 'cash',
        amountCents: 1,
        postedAt: { __serializerId: '@proteinjs/serializer/MomentSerializer', value: 5 },
        memo: 'm',
      })
    );
  });
});

describe('the output contract: every kind round-trips', () => {
  it('a value of every kind reads back deep-equal from the compact form', () => {
    const written = everyKind();
    expectEveryKind(Serializer.deserialize(Serializer.serialize(written)), written);
  });

  it('a value of every kind reads back deep-equal from the earlier indented form', () => {
    const written = everyKind();
    expectEveryKind(Serializer.deserialize(indented(Serializer.serialize(written))), written);
  });

  it('a 600-row document answer reads back deep-equal from the compact form', () => {
    const answer = documentAnswer(600);
    expect(Serializer.deserialize(Serializer.serialize(answer))).toEqual(answer);
  });

  it.each([
    ['text with breaks', 'a\nb\r\nc\t"d" \\ e'],
    ['several scripts', 'naïve 日本語 ✓ 🌍'],
    ['the largest safe integer', Number.MAX_SAFE_INTEGER],
    ['a number past 2^53', 2 ** 60],
    ['the largest double', Number.MAX_VALUE],
    ['a nested array', [[[[]]], [1, [2, [3]]]]],
    ['null', null],
    ['an empty object', {}],
  ])('%s round-trips', (_name, value) => {
    expect(Serializer.deserialize(Serializer.serialize(value))).toEqual(value);
  });

  it('undefined is no text, and reads back as undefined; an undefined field is absent on the wire', () => {
    expect(Serializer.serialize(undefined)).toBeUndefined();
    expect(Serializer.deserialize(Serializer.serialize(undefined))).toBeUndefined();
    expect(Serializer.serialize({ present: 1, absent: undefined })).toBe('{"present":1}');
  });
});
