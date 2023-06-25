export type TagTransformer = (node: Node, text: string) => string;

export const pTag: TagTransformer = (_node: Node, text: string) =>
  text + '\n\n';
