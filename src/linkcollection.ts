import { SpecialTransformer } from './html2gmi';
import { transformLink } from './link';

export const handleLinkCollection: SpecialTransformer = (node: Node) => {
  const element = node as HTMLElement;
  const links = Array.from(
    element.querySelectorAll(
      'li:not([data-gmi-ignore]) a:not([data-gmi-ignore])'
    )
  );
  return links.map(transformLink).join('\n') + '\n\n';
};
