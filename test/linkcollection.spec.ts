import { Html2Gmi } from '../src/html2gmi';
import { generateHtml } from './html/gethtml';

describe('link-collection', () => {
  it('should convert a link-collection', () => {
    const converter = new Html2Gmi(
      generateHtml(`
<ul data-gmi-type="link-collection">
      <li>
        <a href="https://www.example.com">Link 1</a>
      </li>
      <li>
        <a href="https://www.example.com">Link 2</a> This text is ignored
      </li>
      <li data-gmi-ignore>
        <a href="https://www.example.com">Ignored Link</a>
      </li>
      <li>
        <a href="https://www.example.com">Link 3</a> Hehehehehehehe
      </li>
</ul>`)
    );
    expect(converter.convert()).toBe(`=> https://www.example.com Link 1
=> https://www.example.com Link 2
=> https://www.example.com Link 3`);
  });
  it('should work with data-gmi-content', () => {
    const converter = new Html2Gmi(
      generateHtml(`
      <p>Paragraph 1</p>
<ul data-gmi-type="link-collection">
      <li>
        <a href="https://www.example.com">Link 1</a>
      </li>
      <li>
        <a href="https://www.example.com">Link 2</a>
      </li>
      <li>
        <a href="https://www.example.com" data-gmi-ignore>Ignored Link</a>
      </li>
      <li>
        <a href="https://www.example.com" data-gmi-content="Link 3">Link 4</a>
      </li>
</ul>
<p>Paragraph 2</p>`)
    );
    expect(converter.convert()).toBe(`Paragraph 1

=> https://www.example.com Link 1
=> https://www.example.com Link 2
=> https://www.example.com Link 3

Paragraph 2`);
  });
});
