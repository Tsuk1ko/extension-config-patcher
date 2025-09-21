import * as vscode from 'vscode';
import { ConfigPatcher } from './utils/patcher';

export function activate(context: vscode.ExtensionContext) {
  const patcher = new ConfigPatcher();

  if (patcher.config.get<boolean>('enable')) {
    patcher.patch();
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.extension-config-patcher.patch', () => {
      patcher.patch(true);
      patcher.config.update('enable', true, true);
    }),
    vscode.commands.registerCommand('extension.extension-config-patcher.restore', () => {
      patcher.restore();
      patcher.config.update('enable', false, true);
    }),
  );
}

export function deactivate() {}
