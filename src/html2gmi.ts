import * as Handlers from './taghandlers';

type TagTransformer = Handlers.TagTransformer;

export class Html2Gmi {
  protected document: Document;
  protected elementHandlers: Map<string, TagTransformer> = new Map<
    string,
    TagTransformer
  >();
  constructor(protected documentText: string) {
    const parser = new DOMParser();
    this.document = parser.parseFromString(documentText, 'text/html');
    this.registerHandlers();
  }

  protected registerHandlers(): void {
    this.elementHandlers.set('P', Handlers.pTag);
  }

  public runHandler(node: Node, text: string): string {
    if (this.elementHandlers.has(node.nodeName)) {
      const handler = this.elementHandlers.get(node.nodeName);
      if (handler) {
        return handler(node, text);
      }
    }
    return text;
  }

  public unwrapTextContent(child: Node): string {
    let nodeValue = child.nodeValue ?? '';
    nodeValue = nodeValue.replace(/\r/, ''); // Remove carriage returns if written on windows
    nodeValue = nodeValue.replace(/([^\n])\n+([^\n])/, '$1 $2'); // Convert groups of newlines between characters to spaces
    nodeValue = nodeValue.replace(/^\s+$/, ''); // Remove completely empty whitespace content (indents/gaps between tags/etc)
    return nodeValue;
  }

  public convertChild(node: Node): string {
    let text = '';
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeName === '#text') {
        text += this.unwrapTextContent(child);
      } else {
        text += this.convertChild(child);
      }
    }
    return this.runHandler(node, text);
  }

  public convert(): string | null {
    const main = this.document.querySelector('main');
    if (main) {
      return this.convertChild(main).trimEnd();
    }
    return null;
  }
}
