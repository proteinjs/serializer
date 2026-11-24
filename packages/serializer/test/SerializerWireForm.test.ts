import moment from 'moment';
import { SourceRepository } from '@proteinjs/reflection';
import { CustomSerializer, Serializer } from '../src/Serializer';

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

/**
 * Two kinds of this suite's own, each with a serializer in the registry the serializer reads once, before
 * its first use (where a built package's generated index leaves its own):
 *  - a shelf is KEPT: its serializer writes the shelf's name and reads the kept shelf back by that name;
 *  - a loan is MADE from its fields: its serializer counts the days between two moments as it reads them.
 */
const SHELF_SERIALIZER_ID = '@proteinjs/serializer/test/ShelfSerializer';
const LOAN_SERIALIZER_ID = '@proteinjs/serializer/test/LoanSerializer';

type Shelf = { __serializerId: string; name: string; open: boolean };
type Loan = { __serializerId: string; from: moment.Moment; to: moment.Moment; days?: number };

const shelves: { [name: string]: Shelf } = {};

class ShelfSerializer implements CustomSerializer {
  id = SHELF_SERIALIZER_ID;

  serialize(shelf: Shelf): { shelfName: string } {
    return { shelfName: shelf.name };
  }

  deserialize(serialized: { shelfName: string }): Shelf {
    const shelf = shelves[serialized.shelfName];
    if (!shelf) {
      throw new Error(`No shelf is kept under the name: ${serialized.shelfName}`);
    }

    return shelf;
  }
}

class LoanSerializer implements CustomSerializer {
  id = LOAN_SERIALIZER_ID;

  /** A moment rides its own kind inside the loan's form; `SerializableObject` does not type one, so `any`. */
  serialize(loan: Loan): any {
    return { from: loan.from, to: loan.to };
  }

  deserialize(serialized: { from: any; to: any }): Loan {
    const read = moment.isMoment(serialized.from) && moment.isMoment(serialized.to);
    return {
      __serializerId: LOAN_SERIALIZER_ID,
      from: serialized.from,
      to: serialized.to,
      days: read ? serialized.to.diff(serialized.from, 'days') : undefined,
    };
  }
}

SourceRepository.get()
  .objects<CustomSerializer>('@proteinjs/serializer/CustomSerializer')
  .push(new ShelfSerializer(), new LoanSerializer());

describe('a value read back is the one its serializer returned', () => {
  beforeEach(() => {
    shelves.poetry = { __serializerId: SHELF_SERIALIZER_ID, name: 'poetry', open: false };
  });

  it('a kept value is read back as it was kept, whatever else its form carries', () => {
    const read = Serializer.deserialize(
      JSON.stringify({
        shelf: { __serializerId: SHELF_SERIALIZER_ID, shelfName: 'poetry', open: true, note: 'left by a reader' },
      })
    );
    expect(read.shelf).toBe(shelves.poetry);
    expect(shelves.poetry).toEqual({ __serializerId: SHELF_SERIALIZER_ID, name: 'poetry', open: false });
  });

  it('a serializer is handed its form with each field already read back', () => {
    const loan: Loan = {
      __serializerId: LOAN_SERIALIZER_ID,
      from: moment(1_700_000_000_000),
      to: moment(1_700_000_000_000).add(3, 'days'),
    };
    const read = Serializer.deserialize(Serializer.serialize({ loan })).loan as Loan;
    expect(read.days).toBe(3);
    expect(read.to.isSame(loan.to)).toBe(true);
  });

  it('a read that fails leaves a kept value as it was kept', () => {
    const text = JSON.stringify({
      __serializerId: SHELF_SERIALIZER_ID,
      shelfName: 'poetry',
      open: true,
      beside: { __serializerId: SHELF_SERIALIZER_ID, shelfName: 'essays' },
    });
    expect(() => Serializer.deserialize(text)).toThrow('No shelf is kept under the name: essays');
    expect(shelves.poetry).toEqual({ __serializerId: SHELF_SERIALIZER_ID, name: 'poetry', open: false });
  });

  /** Two names no serializer is registered under; the second is a name every object answers to. */
  const NAMES_NOBODY_REGISTERED = ['nobody/registered/this', 'constructor'];

  it('an object that names a serializer nobody registered is read as an ordinary object', () => {
    for (const name of NAMES_NOBODY_REGISTERED) {
      const read = Serializer.deserialize(
        `{"__serializerId":"${name}","title":"a","__proto__":{"done":true},` +
          `"when":{"__serializerId":"@proteinjs/serializer/MomentSerializer","value":1700000000000}}`
      );
      expect(Object.keys(read).sort()).toEqual(['__serializerId', 'title', 'when']);
      expect(moment.isMoment(read.when)).toBe(true);
      expect(Object.getPrototypeOf(read)).toBe(Object.prototype);
    }
  });

  it('an object that names a serializer nobody registered is written as an ordinary object', () => {
    const when = moment(1_700_000_000_000);
    for (const name of NAMES_NOBODY_REGISTERED) {
      expect(Serializer.serialize({ __serializerId: name, title: 'a', when })).toBe(
        JSON.stringify({
          __serializerId: name,
          title: 'a',
          when: { __serializerId: '@proteinjs/serializer/MomentSerializer', value: when.valueOf() },
        })
      );
    }
  });

  it('an object read back has the prototype every object has, whatever fields its text names', () => {
    const read = Serializer.deserialize('{"title":"a","__proto__":{"done":true}}');
    expect(Object.getPrototypeOf(read)).toBe(Object.prototype);
    expect(read.done).toBeUndefined();
    expect(read).toEqual({ title: 'a' });
  });
});
