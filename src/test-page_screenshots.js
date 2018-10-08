import {join} from 'path';
import puppeteer from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';
import {expect} from 'chai';
import {mkDirIfAbsent} from './utils/testing-utils';
import {
   URLS,
   TEST_TIMEOUT,
   SCREENSHOTS_FOR
} from './constants';

// if screenshot directory doesn't exist, create it
const screenshotDir = join(__dirname, '..', 'screenshots');
mkDirIfAbsent(screenshotDir);

describe(`Page Screenshots`,  function () {
   URLS.forEach(url => {

      const screenshotPath = (deviceType, ext="jpg") => {
         let filename = url.replace(/[^a-z0-9]/gi, '-').toLowerCase();
         filename = filename.replace(/-{2,}/gi, '-')

         if (deviceType){
            filename += `-${deviceType}`;
         }
         filename += `.${ext}`;
         return join(screenshotDir, filename);
      }

      describe(`${url}`,  function () {
         this.timeout(TEST_TIMEOUT);

         var browser, page;

         beforeEach(async () => {
            browser = await puppeteer.launch({
               timeout: 0
            });
            page = await browser.newPage(); 
            // await page.goto(url, {waitUntil: 'networkidle2', timeout: 0});
            await page.goto(url, {waitUntil: 'load', timeout: 0});
            await page.setViewport({
               width: 1920,
               height: 1200
            })
         })

         afterEach(async () => {
            await browser.close();
         })
         
         it(`can make pdf screenshots`, async () => {
            await page.pdf({
               path: screenshotPath('pdf', 'pdf'),
               format: 'A4'
            });

            let screenshot = await page.screenshot({
               path: screenshotPath('desktop'),
               quality: 100,
               fullPage: true
            });
            expect(screenshot instanceof Buffer).to.be.true;
         })

         SCREENSHOTS_FOR.forEach(deviceType =>
            it(`can make screenshots for ${deviceType}`, async () => {
               await page.emulate(devices[deviceType]);
               let screenshot = await page.screenshot({
                  path: screenshotPath(deviceType),
                  quality: 100,
                  fullPage: true
               });
               expect(screenshot instanceof Buffer).to.be.true;
            })
         )
      })   
   })
})
