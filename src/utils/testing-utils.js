const {join} = require('path');
const {
   existsSync,
   mkdirSync,
   writeFileSync
} = require('fs');
const devices = require('puppeteer/DeviceDescriptors');


/**
 * Write list of puppeteer/DeviceDescriptors
 * to __dirname/pathRel/filename for reference
 */
const writeDeviceList = (filename="devices.txt", pathRel='..') =>
   writeFileSync(
      join(__dirname, pathRel, filename),
      Object.keys(devices)
         .filter(k => parseInt(k) != k)
         .join('\n')
   );

const getElementStyles = async (frame, selector) =>
   await frame.evaluate((sel) => {
      let el = document.querySelector(sel);
      if (!el){
         throw new Error(`Element ${sel} not found.`);
      }
      else{
         let styles = getComputedStyle(el);
         let styleObj = JSON.stringify(styles);
         return JSON.parse(styleObj);
      }
   }, selector)

const mkDirIfAbsent = path => {
   if (!existsSync(path)) {
      mkdirSync(path);
   }
}


module.exports = {
   writeDeviceList,
   getElementStyles,
   mkDirIfAbsent
}