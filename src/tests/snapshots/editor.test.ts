import { parseAsHTML, deserializeHTMLString } from '../..';
import { initialSlate, deprecatedSlateResp, deprecatedParsedBackground, parsedBackground } from './textBackground';

describe('', () => {
  it('text background with data attributes', () => {
    let counter = 0;
    expect(parseAsHTML(
      initialSlate,
      {},
      async () => {
        counter += 1;
        return { url: 'a' };
      },
    )).toEqual(parsedBackground);
    expect(deserializeHTMLString(parsedBackground))
      .toEqual(initialSlate);
    expect(counter).toEqual(0);
  });

  it('text background w/o data attributes', () => {
    expect(deserializeHTMLString(deprecatedParsedBackground))
      .toEqual(deprecatedSlateResp);
  });
});
