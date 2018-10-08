import puppeteer from 'puppeteer';
import {expect} from 'chai';
import {
   getElementStyles
} from './utils/testing-utils';
import {
   URLS,
   TEST_TIMEOUT,
} from './constants';


describe(`Page Errors`,  function () {
   URLS.forEach(url => {
      describe(`${url}`,  function () {
         this.timeout(TEST_TIMEOUT);

         var browser, page, frame;

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
            frame = page.mainFrame();
         })

         afterEach(async () => {
            await browser.close();
         })

         it(`doesn't have any javascript errors`, async () => {
            let errors = [];
            page.on('pageerror', (err) => {
               console.log(err);
               errors.push(err);
            })
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
            expect(errors).to.be.empty;
         })

         it(`doesn't have any missing assets`, async () => {
            let missingAssets = [];
            page.on('response', (res) => {
               let assetUrl = res.url();
               // console.log(assetUrl);
               if (res.status === 404){
                  missingAssets.push(assetUrl);
                  // throw new Error(`missing asset: ${assetUrl}`);
               }
            })
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
            expect(missingAssets).to.be.empty;
         })
      })
   })
})
