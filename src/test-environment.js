import puppeteer from 'puppeteer';
import {expect} from 'chai';



describe(`browser environment`, () => {
   it(`has a version`, async () => {
      const browser = await puppeteer.launch();
      let v = await browser.version();
      expect(v).to.be.ok;
      await browser.close();
   })
   it(`has a user agent`, async () => {
      const browser = await puppeteer.launch();
      let v = await browser.userAgent();
      expect(v).to.be.string;
      await browser.close();
   })
})