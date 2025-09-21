import { readFile } from 'node:fs/promises';
import * as vscode from 'vscode';
import { log } from './log';

export const readJsonFile = async <T>(path: string) => {
  const file = await readFile(path, 'utf8');
  try {
    return JSON.parse(file) as T;
  } catch (error) {
    vscode.window.showErrorMessage(`Error parsing JSON file: ${path} ${error}`);
    log('Error parsing JSON file:', path);
    log(error);
    return null;
  }
};
