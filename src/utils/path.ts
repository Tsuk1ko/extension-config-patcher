import path from 'node:path';
import * as vscode from 'vscode';

export const APP_ROOT = vscode.env.appRoot;

export const PRODUCT_JSON_PATH = APP_ROOT ? path.join(APP_ROOT, 'product.json') : '';

export const PRODUCT_JSON_BAK_PATH = APP_ROOT ? path.join(APP_ROOT, 'product.bak.json') : '';
