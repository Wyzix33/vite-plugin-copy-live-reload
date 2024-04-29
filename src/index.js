import chokidar from 'chokidar';
import path from 'path';
import fsExtra from 'fs-extra';
export const copyReload = function (options = {}) {
 const { folderToWatch, destinationFolder, reloadPage } = options;
 return {
  name: 'file-watcher',
  apply: 'serve',
  configureServer(server) {
   const watcher = chokidar.watch(folderToWatch, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
   });
   const viteCacheFolder = path.join(destinationFolder, '.vite');
   fsExtra.removeSync(viteCacheFolder);
   watcher.on('add', handleFileChange).on('change', handleFileChange);
   function handleFileChange(filePath) {
    const relativePath = path.relative(folderToWatch, filePath);
    const destinationPath = path.join(destinationFolder, relativePath);
    const dir = path.dirname(destinationPath);
    if (!fsExtra.pathExistsSync(dir)) fsExtra.mkdirpSync(dir);
    fsExtra.copyFile(filePath, destinationPath);
    console.log(`File ${filePath} copied to ${destinationPath}`);
    if (reloadPage) server.ws.send({ type: 'full-reload', path: '*' });
   }
   console.log(`Watching files in ${folderToWatch}...`);
  },
 };
};
