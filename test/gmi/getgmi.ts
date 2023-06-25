import fs from 'fs';
import path from 'path';

export function getGmi(filename: string): string {
  const gmiPath = path.join(__dirname, filename);
  return fs.readFileSync(gmiPath, 'utf-8');
}
