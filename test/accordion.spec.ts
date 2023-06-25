import { Html2Gmi } from '../src/html2gmi';
import { getGmi } from './gmi/getgmi';
import { getHtml } from './html/gethtml';

describe("Natalie's Accordion Corner Test Document", () => {
  test('Expected output', () => {
    const converter = new Html2Gmi(getHtml('accordion.html'));
    expect(converter.convert()).toBe(getGmi('accordion.gmi'));
  });
});
