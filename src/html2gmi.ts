import { transformLink } from './link';
import { handleLinkCollection } from './linkcollection';
import * as Handlers from './taghandlers';
import { JSDOM } from 'jsdom';

global.DOMParser = new JSDOM().window.DOMParser;

type TagTransformer = Handlers.TagTransformer;

export type SpecialTransformer = (node: Node) => string;
export class Html2Gmi {
  protected document: Document;
  protected elementHandlers: Map<string, TagTransformer> = new Map<
    string,
    TagTransformer
  >();
  protected specialHandlers: Map<string, SpecialTransformer> = new Map<
    string,
    SpecialTransformer
  >();
  protected linkBuffer: HTMLAnchorElement[] = [];
  private depth: number = 0;
  constructor(protected documentText: string) {
    const parser = new DOMParser();
    this.document = parser.parseFromString(documentText, 'text/html');
    this.registerHandlers();
  }

  protected registerHandlers(): void {
    this.elementHandlers.set('P', Handlers.pTag);
    this.elementHandlers.set('A', Handlers.aTag);
    this.elementHandlers.set('LI', Handlers.liTag);
    this.elementHandlers.set('H1', Handlers.headingTag);
    this.elementHandlers.set('H2', Handlers.headingTag);
    this.elementHandlers.set('H3', Handlers.headingTag);
    this.elementHandlers.set('H4', Handlers.headingTag);
    this.elementHandlers.set('H5', Handlers.headingTag);
    this.elementHandlers.set('H6', Handlers.headingTag);
    this.elementHandlers.set('Q', Handlers.qTag);
    this.elementHandlers.set('DIV', Handlers.divTag);
    this.elementHandlers.set('BR', Handlers.brTag);
    this.elementHandlers.set('CODE', Handlers.kbdTag);
    this.elementHandlers.set('KBD', Handlers.kbdTag);
    this.elementHandlers.set('VAR', Handlers.kbdTag);

    this.specialHandlers.set('link-collection', handleLinkCollection);
  }

  protected runHandler(node: Node, text: string): string {
    if (this.elementHandlers.has(node.nodeName)) {
      const handler = this.elementHandlers.get(node.nodeName);
      if (handler) {
        return handler(node, text, this);
      }
    }
    return text;
  }

  protected unwrapTextContent(child: Node): string {
    let nodeValue = child.nodeValue ?? '';
    nodeValue = nodeValue.trimStart();
    nodeValue = nodeValue.replace(/\r/gm, ''); // Remove carriage returns if written on windows
    nodeValue = nodeValue.replace(/([^\n]|^)\s*\n+\s*([^\n]|$)/gm, '$1 $2'); // Convert groups of newlines between characters to spaces
    nodeValue = nodeValue.replace(/^\s+$/gm, ''); // Remove completely empty whitespace content (indents/gaps between tags/etc)
    return nodeValue;
  }

  protected convertChild(node: Node): string {
    let text = '';
    const element = node as Element;
    if (element.hasAttribute('data-gmi-ignore')) {
      return '';
    } else if (
      element.hasAttribute('data-gmi-type') &&
      this.specialHandlers.has(`${element.getAttribute('data-gmi-type')}`)
    ) {
      const handler = this.specialHandlers.get(
        `${element.getAttribute('data-gmi-type')}`
      );
      if (handler) {
        text = handler(element);
      }
    } else if (element.hasAttribute('data-gmi-content')) {
      text = `${element.getAttribute('data-gmi-content')}`;
    } else {
      const children = Array.from(node.childNodes);
      for (const child of children) {
        if (child.nodeName === '#text') {
          text += this.unwrapTextContent(child);
        } else {
          this.depth++;
          text += this.convertChild(child);
          this.depth--;
        }
        if (this.depth === 0) {
          text += this.getLinkBuffer();
        }
      }
    }
    return this.runHandler(node, text);
  }

  public convert(): string {
    const main = this.document.querySelector('main');
    if (main) {
      return this.convertChild(main).trim();
    }
    return '';
  }

  public addLinkToBuffer(element: Element): void {
    if (element.tagName === 'A') {
      this.linkBuffer.push(element as HTMLAnchorElement);
    }
  }

  protected getLinkBuffer(): string {
    let text = this.linkBuffer.map(transformLink).join('\n');
    if (text) {
      text += '\n\n';
    }
    this.linkBuffer = [];
    return text;
  }
}
