import { parseAsHTML, deserializeHTMLString } from '../';
import * as textBackgroundSnapshots from './snapshots/textBackground';
import * as uploadedImageSnapshots from './snapshots/uploadedImage';
import * as variableInsert from './snapshots/variableInsert';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));

describe('slate editor', () => {
  it('text background with data attributes', async () => {
    let counter = 0;
    expect(await parseAsHTML(
      textBackgroundSnapshots.initialSlate,
      {},
      async () => {
        counter += 1;
        return { url: 'a' };
      },
    )).toEqual(textBackgroundSnapshots.parsedBackground);
    expect(deserializeHTMLString(textBackgroundSnapshots.parsedBackground))
      .toEqual(textBackgroundSnapshots.initialSlate);
    expect(counter).toEqual(0);
  });

  it('text background w/o data attributes', () => {
    expect(deserializeHTMLString(textBackgroundSnapshots.deprecatedParsedBackground))
      .toEqual(textBackgroundSnapshots.deprecatedSlateResp);
  });

  it('uploaded image by id', async () => {
    let counter = 0;
    expect(await parseAsHTML(
      uploadedImageSnapshots.initialSlate,
      {},
      async () => {
        counter += 1;
        return { url: 'a' };
      },
    )).toEqual(uploadedImageSnapshots.slateHTML);
    expect(counter).toEqual(1);
    expect(deserializeHTMLString(uploadedImageSnapshots.slateHTML))
      .toEqual(uploadedImageSnapshots.initialSlate);
  });

  it('renders variables', async () => {
    let counter = 0;
    console.log(await parseAsHTML(
      variableInsert.initialSlate,
      { foo: 'bar' },
      async () => {
        counter += 1;
        return { url: 'a' };
      },
    ));
    expect(await parseAsHTML(
      variableInsert.initialSlate,
      { foo: 'bar' },
      async () => {
        counter += 1;
        return { url: 'a' };
      },
    )).toEqual(variableInsert.slateHTML);
    expect(deserializeHTMLString(variableInsert.slateHTML))
      .toEqual(variableInsert.initialSlate);
    expect(counter).toEqual(0);
  })
});
