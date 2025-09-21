import { existsSync } from 'node:fs';
import { copyFile } from 'node:fs/promises';
import { merge } from 'es-toolkit';
import { isMatch } from 'es-toolkit/compat';
import * as vscode from 'vscode';
import { writeJsonFile } from 'write-json-file';
import { readJsonFile } from './file';
import { log } from './log';
import { APP_ROOT, PRODUCT_JSON_BAK_PATH, PRODUCT_JSON_PATH } from './path';

const patchObj = {
  extensionsGallery: {
    serviceUrl: 'https://marketplace.visualstudio.com/_apis/public/gallery',
    resourceUrlTemplate: 'https://{publisher}.vscode-unpkg.net/{publisher}/{name}/{version}/{path}',
  },
};

type ProductJson = typeof patchObj;

export class ConfigPatcher {
  constructor() {
    log('App root:', APP_ROOT);
  }

  get config() {
    return vscode.workspace.getConfiguration('extensionConfigPatcher');
  }

  async patch(byCommand = false) {
    const { productJsonExists, productJsonBackupExists } = this.checkFileExists();
    if (!productJsonExists) {
      vscode.window.showErrorMessage('Cannot find config file');
      return;
    }

    // backup
    if (!productJsonBackupExists) {
      try {
        await copyFile(PRODUCT_JSON_PATH, PRODUCT_JSON_BAK_PATH);
      } catch (error) {
        vscode.window.showErrorMessage(`Backup config failed: ${error}`);
        log('Backup product.json failed:', error);
        return;
      }
    }

    const productJson = await readJsonFile<ProductJson>(PRODUCT_JSON_PATH);
    if (!productJson) return;

    if (isMatch(productJson, patchObj)) {
      log('product.json is already patched');
      if (byCommand) {
        vscode.window.showInformationMessage('Extension config is already patched');
      }
      return;
    }

    merge(productJson, patchObj);

    try {
      await writeJsonFile(PRODUCT_JSON_PATH, productJson, { detectIndent: true });
    } catch (error) {
      vscode.window.showErrorMessage(`Patch failed: ${error}`);
      log('Write product.json failed:', error);
      return;
    }

    vscode.window.showInformationMessage(
      'Extension config patched successfully! Please restart the editor (not reload window) for the changes to take effect.',
    );
  }

  async restore() {
    const { productJsonExists, productJsonBackupExists } = this.checkFileExists();

    if (!productJsonBackupExists) {
      vscode.window.showErrorMessage('Extension config is not patched yet');
      return;
    }

    if (!productJsonExists) {
      vscode.window.showErrorMessage('Cannot find config file');
      return;
    }

    const productJsonBackup = await readJsonFile<ProductJson>(PRODUCT_JSON_BAK_PATH);
    if (!productJsonBackup) return;

    const productJson = await readJsonFile<ProductJson>(PRODUCT_JSON_PATH);
    if (!productJson) return;

    const { serviceUrl, resourceUrlTemplate } = productJsonBackup?.extensionsGallery || {};
    if (!serviceUrl || !resourceUrlTemplate) {
      vscode.window.showErrorMessage('Extension config backup is invalid');
      return;
    }

    const patchBackObj: ProductJson = {
      extensionsGallery: {
        serviceUrl,
        resourceUrlTemplate,
      },
    };

    merge(productJson, patchBackObj);

    try {
      await writeJsonFile(PRODUCT_JSON_PATH, productJson, { detectIndent: true });
    } catch (error) {
      vscode.window.showErrorMessage(`Restore config failed: ${error}`);
      log('Write product.json failed:', error);
      return;
    }

    vscode.window.showInformationMessage(
      'Extension config restored successfully! Please restart the editor (not reload window) for the changes to take effect.',
    );
  }

  private checkFileExists() {
    let productJsonExists = false;
    let productJsonBackupExists = false;

    if (PRODUCT_JSON_PATH) {
      productJsonExists = existsSync(PRODUCT_JSON_PATH);
    }
    if (productJsonExists) {
      log('product.json exists:', PRODUCT_JSON_PATH);
    } else {
      log('product.json does not exist');
    }

    if (PRODUCT_JSON_BAK_PATH) {
      productJsonBackupExists = existsSync(PRODUCT_JSON_BAK_PATH);
    }
    if (productJsonBackupExists) {
      log('product.json backup exists:', PRODUCT_JSON_BAK_PATH);
    } else {
      log('product.json backup does not exist');
    }

    return {
      productJsonExists,
      productJsonBackupExists,
    };
  }
}
