import {join} from 'path';
import {
   existsSync,
   mkdirSync,
   writeFileSync
} from 'fs';
import devices from 'puppeteer/DeviceDescriptors';


/**
 * Write list of puppeteer/DeviceDescriptors
 * to __dirname/pathRel/filename for reference
 */
export const writeDeviceList = (filename="devices.txt", pathRel='..') =>
   writeFileSync(
      join(__dirname, pathRel, filename),
      Object.keys(devices)
         .filter(k => parseInt(k) != k)
         .join('\n')
   );

export const getElementStyles = async (frame, selector) =>
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

export const mkDirIfAbsent = path => {
   if (!existsSync(path)) {
      mkdirSync(path);
   }
}