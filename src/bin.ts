#!/usr/bin/env ts-node
import { parseArguments } from './argparse';
import * as fs from 'fs';
import { Html2Gmi } from './html2gmi';

const options = parseArguments();
const filecontents = fs.readFileSync(options.input, 'utf-8');
const converter = new Html2Gmi(filecontents);
process.stdout.write(converter.convert());
