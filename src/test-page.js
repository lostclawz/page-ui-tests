import {join} from 'path';
import puppeteer from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';
import {expect} from 'chai';
import {
   getElementStyles,
   mkDirIfAbsent
} from './utils/testing-utils';

const TEST_TIMEOUT = 30000;
const url = 'http://www.kupex.com/';
const label = "site";
const screenshotsFor = [
   'iPhone 6',
   'iPad Pro landscape',
   'Galaxy S5'
];

const screenshotDir = join(__dirname, '..', 'screenshots');
mkDirIfAbsent(screenshotDir);

const screenshotPath = (deviceType, ext="jpg") => {
   let filename = label || 'site';
   if (deviceType){
      filename += `-${deviceType}`;
   }
   filename += `.${ext}`;
   return join(screenshotDir, filename);
}


describe(`Page Tests for ${url}`,  function () {
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

   describe(`browser environment`, () => {
      it(`has a version`, async () => {
         let v = await browser.version();
         console.log(v);
         expect(v).to.be.ok;
      })
      it(`has a user agent`, async () => {
         let v = await browser.userAgent();
         expect(v).to.be.string;
      })
   })

   describe(`errors`, () => {
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

   describe('screenshots', () => {
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

      screenshotsFor.forEach(deviceType =>
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
            title => title.innerHTML
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
