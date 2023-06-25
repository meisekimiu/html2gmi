import { Html2Gmi } from '../src/html2gmi';
import { generateHtml } from './html/gethtml';

describe('Link handling', () => {
  it('can handle a very basic link', () => {
    const converter = new Html2Gmi(
      generateHtml(`<a href="https://example.com">An example link</a>`)
    );
    expect(converter.convert()).toBe(`=> https://example.com An example link`);
  });
  it('will not on activate anchors that are not links', () => {
    const converter = new Html2Gmi(generateHtml('<a>flippy</a>'));
    expect(converter.convert()).toBe('flippy');
  });
  it('can drop a link if given a `data-gmi-drop-link` attribute', () => {
    const converter = new Html2Gmi(
      generateHtml(
        `<a href="https://example.com" data-gmi-drop-link>Not a link</a>`
      )
    );
    expect(converter.convert()).toBe('Not a link');
  });
  it('stores links in buffer and only outputs them in between paragraphs', () => {
    const converter = new Html2Gmi(
      generateHtml(
        `<p>Hello world. <a href="https://example.com">Here is a link.</a> Goodbye world.</p>`
      )
    );
    expect(converter.convert()).toBe(`Hello world. Goodbye world.

=> https://example.com Here is a link.`);
  });
  it('works with `data-gmi-content`', () => {
    const converter = new Html2Gmi(
      generateHtml(
        `<a href="https://example.com" data-gmi-content="WWW Example Link">Click Here</a>
        
        <p>Have you ever gone to example.com? <a href="https://example.com" data-gmi-content="Example.com">Click here to go!</a></p>`
      )
    );
    expect(converter.convert()).toBe(`=> https://example.com WWW Example Link

Have you ever gone to example.com?

=> https://example.com Example.com`);
  });
  it('converts .html extension to .gmi', () => {
    const converter = new Html2Gmi(
      generateHtml('<a href="example.html">Link</a>')
    );
    expect(converter.convert()).toBe('=> example.gmi Link');
  });
  it('has support for data-gmi-footnote style of links', () => {
    const converter = new Html2Gmi(
      generateHtml(
        `<p>Have you ever heard of <a href="https://example.com" data-gmi-footnote="Example.com">Example.com?</a>`
      )
    );
    expect(converter.convert()).toBe(`Have you ever heard of Example.com?

=> https://example.com Example.com`);
  });
});
