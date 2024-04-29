# vite-plugin-live-reload

A simple copy and live reloading plugin for [vite](https://github.com/vitejs/vite).

## Example

I use this configuration when working PHP, but it works great with any backend!

Note: by default the paths are relative to Vite's root folder.

```js
// vite.config.js
import copyReload from 'vite-plugin-copy-live-reload';

export default {
 // ...
 /**
  * This is an example configuration for the vite-plugin-copy-live-reload plugin.
  * Copy files from src/public to XAMPP's htdocs folder and reload the page
  * in the browser.
  */
 plugins: [
  copyReload({
   /**
    * The folder containing the files to copy. Relative to Vite's root folder.
    */
   folderToWatch: 'src/public',
   /**
    * The destination folder.
    */
   destinationFolder: 'C:\\xampp\\htdocs\\',
   /**
    * Reload the page in the browser.
    */
   reloadPage: true,
  }),
 ],
};
```

## Usage

The plugin will delete the `.vite/manifest.json` so make sure you set `manifest: true` in vite.config.js

The plugin uses a [chokidar](https://github.com/paulmillr/chokidar) watcher. See the chokidar documentation to find out which path notations are supported.

I needed a way to develop a php website using vite and since i couldn't find a plugin that will watch for php modifications and reload the page i made one :)

## Example usage for php:

# vite.config.js

```
import { defineConfig } from 'vite';
import copyReload from 'vite-plugin-copy-live-reload';

/**
 * The main vite configuration file.
 */
export default defineConfig({
  /**
   * The plugins used by vite.
   */
  plugins: [
    /**
     * This plugin copies files from `src/public` to a destination folder
     * and reloads the page in the browser when the files are updated.
     */
    copyReload({
      /**
       * The folder containing the files to copy. Relative to Vite's root folder.
       */
      folderToWatch: 'src/public',
      /**
       * The destination folder.
       */
      destinationFolder: 'C:\\xampp\\htdocs\\',
      /**
       * Reload the page in the browser.
       */
      reloadPage: true,
    }),
  ],
  /**
   * The Vite server configuration.
   */
  server: {
    /**
     * The port of the Vite server.
     */
    port: 8888,
    /**
     * Enforce the port to be strictly the one specified in the config.
     * Otherwise, it will increment the port until a free one is found.
     */
    strictPort: true,
  },
  /**
   * Write a manifest.json file containing a mapping from entry module name to
   * the corresponding output file.
   */
  manifest: true,
  //...
});


```

# index.php

```
<?php
/**
 * index.php
 *
 * This is the default entry point for our PHP application.
 * If we have a manifest file, we use that to load the compiled JS and CSS
 * files. If not, we assume we're in development mode and load the files
 * from the Vite dev server.
 */
if (file_exists(".vite/manifest.json")) {
  /**
   * If we have a manifest file, we load the styles and scripts from there.
   */
  $manifest = file_get_contents(".vite/manifest.json");
  $manifest = json_decode($manifest);
  /**
   * The CSS file is the first item in the `css` array for the entry point `index.js`
   */
  $css = "<link rel='stylesheet' href='" . $manifest->{'index.js'}->css[0] . "' type='text/css' />";
  /**
   * The compiled JS file is the value of the `file` property for the entry point `index.js`
   */
  $js = $manifest->{'index.js'}->file;
} else {
  /**
   * If we don't have a manifest file, we assume we're in development mode
   * and load the files from the Vite dev server.
   */
  $js = "http://localhost:8888/index.js";
}

?><!DOCTYPE html>
<html lang="ro">
<head>
  <!-- ... -->
  <?= $css ?>
</head>
<body>
  <!-- ... -->
  <script type="module" src="<?= $js ?>"></script>
</body>
</html>
 ';


```
