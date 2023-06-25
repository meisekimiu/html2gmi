const convertExtension = (link: string) => link.replace(/\.html$/, '.gmi');

export const transformLink = (element: Element) => {
  const textContent = element.hasAttribute('data-gmi-content')
    ? element.getAttribute('data-gmi-content')
    : element.textContent;
  const href = element.getAttribute('href') ?? '';
  const link = href.match(/^[a-z]+:\/\//) ? href : convertExtension(href);
  return `=> ${link} ${textContent}`;
};
