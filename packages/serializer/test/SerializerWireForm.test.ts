import moment from 'moment';
import { Serializer } from '../src/Serializer';

/**
 * The wire form: `Serializer.serialize` writes COMPACT JSON — the bytes `JSON.stringify` writes
 * with no indentation — and `Serializer.deserialize` reads any JSON text of the same value, the
 * earlier indented form included. A service answer of a few megabytes crosses the wire on every
 * open of a large document; indentation was whitespace the receiver discards, paid for on the
 * server's event loop at serialization, on the wire, and again at the parse.
 *
 * Pinned here as OUTCOMES: the bytes written (byte-equal to compact `JSON.stringify`), the value
 * read back from them, and the value read back from the earlier indented form — so a reader built
 * before this change and a writer built after it, or the reverse, agree on every value.
 */

/**
 * The package's own custom serializers (a moment, a graph) are registered by the generated
 * reflection index — the same registration the built package performs when an application imports
 * it. Run `npm run build` first, as the workspace does before it tests.
 */
import '../generated';

/** A document-shaped value: rows with text in several scripts, nested objects, empty containers, nulls. */
const document = {
  id: 'root-1',
  title: 'A document',
  rows: Array.from({ length: 40 }, (_, i) => ({
    id: `row-${i}`,
    index: i,
    text: `Row ${i}: “quoted” — naïve ✓ 🌍 é and a "double quote" and a\nline break`,
    tags: ['a', 'b'],
    done: i % 2 === 0,
    score: i / 3,
    parent: i === 0 ? null : `row-${i - 1}`,
    meta: { depth: i % 4, empty: {}, none: [] as string[] },
  })),
};

/** The indented form the serializer wrote before the wire form was made compact. */
const indented = (value: unknown) => JSON.stringify(value, null, 2);

describe('the wire form is compact', () => {
  it('a document serializes to the bytes compact JSON.stringify writes — no indentation', () => {
    const serialized = Serializer.serialize(document);
    expect(serialized).toBe(JSON.stringify(document));
    expect(serialized).not.toContain('\n');
    expect(serialized.length).toBeLessThan(indented(document).length);
  });

  it('an array serializes compact too', () => {
    const value = [document.rows[0], document.rows[1], [1, 2, [3]], 'text'];
    expect(Serializer.serialize(value)).toBe(JSON.stringify(value));
  });

  it.each([['text'], [42], [-1.5], [0], [true], [false], [null]])(
    'a scalar %p serializes as JSON.stringify writes it',
    (value) => {
      expect(Serializer.serialize(value)).toBe(JSON.stringify(value));
    }
  );

  it('undefined serializes to no text at all, and reads back as undefined', () => {
    expect(Serializer.serialize(undefined)).toBeUndefined();
    expect(Serializer.deserialize(undefined as unknown as string)).toBeUndefined();
    expect(Serializer.deserialize('undefined')).toBeUndefined();
  });

  it('a custom-serialized value (a moment) rides the same compact form', () => {
    const when = moment(1_700_000_000_000);
    const serialized = Serializer.serialize({ when, label: 'x' });
    expect(serialized).toBe(
      JSON.stringify({
        when: { __serializerId: '@proteinjs/serializer/MomentSerializer', value: when.valueOf() },
        label: 'x',
      })
    );
  });
});

describe('the parse road reads the value back from either form', () => {
  it('round-trips a document through the compact form', () => {
    expect(Serializer.deserialize(Serializer.serialize(document))).toEqual(document);
  });

  it.each([['text'], [42], [-1.5], [0], [true], [false], [null]])('round-trips a scalar %p', (value) => {
    expect(Serializer.deserialize(Serializer.serialize(value))).toEqual(value);
  });

  it('reads the earlier indented form of a document to the same value', () => {
    expect(Serializer.deserialize(indented(document))).toEqual(document);
  });

  it('round-trips a moment through the compact form, and reads it from the earlier indented form', () => {
    const when = moment(1_700_000_000_000);
    const compact = Serializer.deserialize(Serializer.serialize({ when }));
    expect(moment.isMoment(compact.when)).toBe(true);
    expect(compact.when.isSame(when)).toBe(true);

    const earlier = Serializer.deserialize(
      indented({ when: { __serializerId: '@proteinjs/serializer/MomentSerializer', value: when.valueOf() } })
    );
    expect(moment.isMoment(earlier.when)).toBe(true);
    expect(earlier.when.isSame(when)).toBe(true);
  });
});
