import { Html2Gmi } from './html2gmi';

export type TagTransformer = (
  node: Node,
  text: string,
  converter: Html2Gmi
) => string;

export const pTag: TagTransformer = (_node: Node, text: string) =>
  text.trim() + '\n\n';

export const aTag: TagTransformer = (
  node: Node,
  text: string,
  converter: Html2Gmi
) => {
  const element = node as Element;
  const href = element.getAttribute('href');
  const dropLink = element.hasAttribute('data-gmi-drop-link');
  if (!href || dropLink) {
    return text + ' ';
  } else {
    converter.addLinkToBuffer(element);
    return '';
  }
};

export const headingTag: TagTransformer = (node: Node, text: string) => {
  const level = Math.min(parseInt(node.nodeName.substring(1)), 3);
  return new Array(level).fill('#').join('') + ' ' + text + '\n\n';
  // unhinged code alert
};

export const liTag: TagTransformer = (_node: Node, text: string) => {
  return '* ' + text + '\n';
};

export const qTag: TagTransformer = (_node: Node, text: string) => {
  return '"' + text + '"';
};
