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

         it(`doesn't have any missing resources`, async () => {
            let failures = [];
            page.on('response', response => {
               if (response.status() === 404){
                  failures.push(response.url());
               }
            })
            await page.goto(url, { waitUntil: 'load', timeout: 0 });
            if (failures.length){
               throw new Error(`${failures.length} missing resource(s): \n ${failures.join('\n')}\n`)
            }
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

      })
   })
})
