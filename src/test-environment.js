import puppeteer from 'puppeteer';
import {expect} from 'chai';


describe(`browser environment`, () => {

   var browser;

   before(async function(){
      browser = await puppeteer.launch();
   })

   after(async function(){
      await browser.close();
   })

   it(`has a version`, async () => {
      let v = await browser.version();
      expect(v).to.be.ok;
   })
   it(`has a user agent`, async () => {
      let v = await browser.userAgent();
      expect(v).to.be.string;
   })

})