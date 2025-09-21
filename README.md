# Extension Config Patcher

A VS Code extension that patches the editor's configuration to enable access to the VS Code extension marketplace for non-official VS Code editors.

It will automatically check and apply patches when the editor starts up.

After patching or restoring, you need to **restart the editor** (not reload window) for the changes to take effect.

## Commands

- `patch`: Apply patch
- `restore`: Restore to the original configuration

## Uninstall

Uninstalling the extension will **not** automatically restore the configuration.

If you need to restore the configuration, please manually run the `restore` command **before** uninstalling the extension.

## Details

The extension modifies the `resources/app/product.json` file by updating following configuration:

```json
{
  "extensionsGallery": {
    "serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",
    "resourceUrlTemplate": "https://{publisher}.vscode-unpkg.net/{publisher}/{name}/{version}/{path}"
  }
}
```

This configuration allows the editor to connect to the official VS Code extension marketplace, allowing you to search and install extensions that were previously unavailable in your editor's marketplace.
