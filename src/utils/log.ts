import * as vscode from 'vscode';

const logChannel = vscode.window.createOutputChannel('Cursor Extension Config Patcher');

export const log = (...args: any[]) => {
  console.log(...args);
  logChannel.appendLine(args.join(' '));
};
