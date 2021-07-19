import { parseAsHTML, deserializeHTMLString } from '../';
import * as textBackgroundSnapshots from './snapshots/textBackground';
import * as uploadedImageSnapshots from './snapshots/uploadedImage';
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

  it.only('uploaded image by id', async () => {
    let counter = 0;
    expect(await parseAsHTML(
      uploadedImageSnapshots.initialSlate,
      {},
      async () => {
        counter += 1;
        return { url: 'a' };
      },
    )).toEqual(uploadedImageSnapshots.slateHTML);
    expect(deserializeHTMLString(uploadedImageSnapshots.slateHTML))
      .toEqual(uploadedImageSnapshots.initialSlate);
  });
});
