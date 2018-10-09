import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import devices from 'puppeteer/DeviceDescriptors';
import {expect} from 'chai';
import {
   getElementStyles,
   hasClass
} from './utils/testing-utils';
import {
   URLS,
   TEST_TIMEOUT,
} from './constants';

const dotEnvConfig = dotenv.config();
const {
   MENU_SELECTOR,
   MENU_LINK_SELECTOR
} = process.env;

describe(`Page Tests`,  function () {
   URLS.forEach(url => {

      describe(`${url}`,  function () {
         this.timeout(TEST_TIMEOUT);

         var browser, page;

         describe('page interactions', () => {
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

            it(`menu becomes fixed only after scrolling`, async () => {
               let menuStyles;
               await page.emulate(devices['iPhone X']);
               // scroll to top of page
               await page.evaluate(() => window.scrollTo(0, 0))
               menuStyles = await getElementStyles(page, MENU_SELECTOR);
               expect(
                  menuStyles.position, `menu isn't initially fixed`
               ).to.not.equal('fixed');
               // scroll to a point where top-fixed should be applied
               await page.evaluate(() => window.scrollTo(0, 1200))
               menuStyles = await getElementStyles(page, MENU_SELECTOR);
               expect(menuStyles.position).to.equal('fixed');
            })

            it(`menu link toggles menu's open class on click`, async () => {
               let menuOpen;
               await page.setViewport({
                  width: 600,
                  height: 800
               });
               await page.evaluate(() => window.scrollTo(0, 1200))
               menuOpen = await hasClass(page, MENU_SELECTOR, 'open');
               expect(menuOpen).to.be.false;
               await page.click(MENU_LINK_SELECTOR);
               menuOpen = await hasClass(page, MENU_SELECTOR, 'open');
               expect(menuOpen).to.be.true;
            })
         })

         describe(`page elements`, () => {
            before(async () => {
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

            after(async () => {
               await browser.close();
            })
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
               let frame = page.mainFrame();
               let frameContent = await frame.content();
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
               let bodyStyle = await getElementStyles(page, 'body');
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
