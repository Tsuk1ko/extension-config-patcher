import * as vscode from 'vscode';

const logChannel = vscode.window.createOutputChannel('Extension Config Patcher');

export const log = (...args: any[]) => {
  console.log(...args);
  logChannel.appendLine(args.join(' '));
};
