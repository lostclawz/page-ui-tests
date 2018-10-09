import puppeteer from 'puppeteer';
import {expect} from 'chai';
import {
   URLS,
   TEST_TIMEOUT,
} from './constants';


describe(`Page Errors`,  function () {
   URLS.forEach(url => {
      describe(`${url}`,  function () {

         this.timeout(TEST_TIMEOUT);

         var browser, page;
         let missingResources = [];
         let javascriptErrors = [];

         before(async () => {
            browser = await puppeteer.launch({
               timeout: 0
            });

            page = await browser.newPage(); 
            
            // listen for missing 404 responses
            page.on('response', response => {
               if (response.status() === 404){
                  missingResources.push(response.url());
               }
            })

            // listen for javascript errors
            page.on('pageerror', (err) => {
               console.log(err);
               javascriptErrors.push(err);
            })

            await page.goto(url, {waitUntil: 'load', timeout: 0});
         })

         after(async () => {
            await browser.close();
         })

         it(`doesn't have any missing resources`, async () => {
            if (missingResources.length){
               throw new Error(`${missingResources.length} missing resource(s): \n ${
                  missingResources.join('\n')
               }\n`)
            }
         })

         it(`doesn't have any javascript errors`, async () => {
            if (javascriptErrors.length){
               throw new Error(`${javascriptErrors.length} javascript error(s): \n ${
                  javascriptErrors.join('\n')
               }\n`)
            }
            expect(javascriptErrors).to.be.empty;
         })

      })
   })
})
