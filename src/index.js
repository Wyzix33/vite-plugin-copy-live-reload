import chokidar from 'chokidar';
import path from 'path';
import fsExtra from 'fs-extra';
export const copyReload = function (options = {}) {
 const { folderToWatch, destinationFolder, reloadPage } = options;
 return {
  name: 'file-watcher',
  apply: 'serve',
  configureServer(server) {
   const watcher = chokidar.watch(folderToWatch, { ignored: /(^|[\/\\])\../, persistent: true });
   const viteCacheFolder = path.join(destinationFolder, '.vite');
   fsExtra.removeSync(viteCacheFolder);
   watcher.on('add', (filePath) => handleFileChange(filePath)).on('change', (filePath) => handleFileChange(filePath));
   function handleFileChange(filePath) {
    const relativePath = path.relative(folderToWatch, filePath);
    const destinationPath = path.join(destinationFolder, relativePath);
    fsExtra
     .ensureDir(path.dirname(destinationPath))
     .then(() => fsExtra.copyFile(filePath, destinationPath))
     .then(() => {
      console.log(`File ${filePath} copied to ${destinationPath}`);
      if (reloadPage) server.ws.send({ type: 'full-reload', path: '*' });
     })
     .catch((err) => console.error('Error copying file:', err));
   }
   console.log(`Watching files in ${folderToWatch}...`);
  },
 };
};
