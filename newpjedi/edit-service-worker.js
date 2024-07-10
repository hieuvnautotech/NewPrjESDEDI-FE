const fs = require('fs');
const path = require('path');
const filePath = 'publish/service-worker.js';

const formatDate = () => {
  let currentDate = new Date();

  // Lấy các thành phần ngày, tháng, năm, giờ, phút, giây
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0 (tháng 0 là tháng 1)
  let year = currentDate.getFullYear();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  // Định dạng thành dạng DD/MM/YYYYHHmmss
  let result =
    (day < 10 ? '0' : '') +
    day +
    (month < 10 ? '0' : '') +
    month +
    year +
    (hours < 10 ? '0' : '') +
    hours +
    (minutes < 10 ? '0' : '') +
    minutes +
    (seconds < 10 ? '0' : '') +
    seconds;
  return result;
};

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const modifiedData = data
    .replace(/const cacheName = '(.*?)'/, `const cacheName = '${formatDate()}'`)
    .replace(/const cacheAssets = \[\s*([^;]+)\s*\];/, (match, assets) => {
      const jsFolderPath = path.join(__dirname, 'publish/js');
      const files = fs.readdirSync(jsFolderPath);
      const newAssetsJs = files
        .filter((file) => fs.statSync(path.join(jsFolderPath, file)).isFile())
        .map((file) => `'/js/${file}'`);
      //.join(', ');
      const imagesFolderPath = path.join(__dirname, 'publish/images');
      const filesImages = fs.readdirSync(imagesFolderPath);
      const newAssetsImages = filesImages
        .filter((file) => fs.statSync(path.join(imagesFolderPath, file)).isFile())
        .map((file) => `'/images/${file}'`);
      const newAssets = newAssetsJs.concat(newAssetsImages).join(', ');
      return `const cacheAssets = [${newAssets}];`;
    });

  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File service-worker.js has been modified.');
  });
});

fs.readFile('publish/OneSignalSDKWorker.js', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const modifiedData = data
    .replace(
      "importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');",
      `importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js?v=${Date.now()}');`
    )
    .replace("importScripts('/service-worker.js');", `importScripts('/service-worker.js?v=${Date.now()}');`);

  fs.writeFile('publish/OneSignalSDKWorker.js', modifiedData, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File service-worker.js has been modified.');
  });
});
