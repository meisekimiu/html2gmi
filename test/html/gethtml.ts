import fs from 'fs';
import path from 'path';

export function getHtml(filename: string): string {
  const htmlPath = path.join(__dirname, filename);
  return fs.readFileSync(htmlPath, 'utf-8');
}

export function generateHtml(contents: string): string {
  const html = getHtml('template.html');
  return html.replace('{{CONTENTS}}', contents);
}
