import puppeteer from 'puppeteer';
import {expect} from 'chai';
import {
   getElementStyles
} from './utils/testing-utils';
import {
   URLS,
   TEST_TIMEOUT,
} from './constants';


describe(`Page Elements`,  function () {
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

         describe(`page elements`, () => {
            it(`has dom nodes`, async () => {
               let metrics = await page.metrics();
               expect(metrics.Nodes).to.be.greaterThan(0);
            })

            it(`has a body element`, async () => {
               // await page.goto(url, {waitUntil: 'domcontentloaded'});
               const header = await page.$('body');
               expect(header).not.be.null;
            })

            it(`has a title element and it isn't empty`, async () => {
               let title = await page.$eval(
                  'title',
                  title => title.textContent
               );
               expect(title).to.be.string;
               expect(title).to.not.be.empty;
            })

            it(`has html`, async () => {
               let frameContent = await frame.content();
               // let html = await frame.$eval('body', el => el.innerHTML);
               // console.log(frameContent);
               expect(typeof frameContent).to.equal('string');
               expect(frameContent.length).to.be.greaterThan(0);
            })

            it(`has metatags`, async () => {
               let metaTags = await page.$$('meta');
               expect(metaTags.length).to.be.greaterThan(0);
            })

            it(`can click an element`, async () => {
               return await page.evaluate(() => {
                  // console.log(document.querySelector('body'))
                  document.querySelector('body').click();
               });
            })

            it(`has a body element with a few expected styles`, async () => {
               let bodyStyle = await getElementStyles(frame, 'body');
               expect( Object.keys(bodyStyle).length ).to.be.greaterThan(0);
               expect(bodyStyle).to.contain.keys([
                  'display', 'position', 'top', 'left'
               ]);
            })

            it(`has dimensions`, async () => {
               // Get the "viewport" of the page, as reported by the page.
               const {
                  width, height
               } = await page.evaluate(() => ({
                  width: document.documentElement.clientWidth,
                  height: document.documentElement.clientHeight,
                  deviceScaleFactor: window.devicePixelRatio
               }));
               expect(width).to.be.greaterThan(0);
               expect(height).to.be.greaterThan(0);
            }) 
         })
      })   
   })
})