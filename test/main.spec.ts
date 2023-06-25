import { Html2Gmi } from '../src/html2gmi';
import { getHtml, generateHtml } from './html/gethtml';

describe('html2gmi', () => {
  it('grabs text content from <main> element', () => {
    const converter = new Html2Gmi(getHtml('main.html'));
    expect(converter.convert()).toBe('Hello World!');
  });
  it('puts newlines between paragraphs', () => {
    const converter = new Html2Gmi(
      generateHtml('<p>Paragraph 1</p><p>Paragraph 2</p>Paragraph 3')
    );
    expect(converter.convert()).toBe(
      `Paragraph 1

Paragraph 2

Paragraph 3`
    );
  });
  it('un-wraps text content', () => {
    const converter = new Html2Gmi(
      generateHtml(
        `<p>Potatoes are
delicious</p>
<p>So

delicious!</p>`
      )
    );
    expect(converter.convert()).toBe(
      `Potatoes are delicious

So delicious!`
    );
  });
  it('un-indents text content', () => {
    const converter = new Html2Gmi(
      generateHtml(`
        <p>Potato</p>
        <p>Potato2</p>
        <p>Potato3</p>
      `)
    );
    expect(converter.convert()).toBe(
      `Potato

Potato2

Potato3`
    );
  });
});
