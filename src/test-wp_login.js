
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import {
   expect,
   assert
} from 'chai';
import {
   TEST_TIMEOUT
} from './constants';
import {validUrl} from './utils/testing-utils';

const dotEnvConfig = dotenv.config();
let {
   WP_USERNAME,
   WP_PASSWORD,
   WP_DOMAIN
} = process.env;


describe('Wordpress login process', function(){
   this.timeout(TEST_TIMEOUT);

   var browser, page;

   beforeEach(async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
   })

   afterEach(async () => {
      await browser.close();
   })

   it(`has access to .env`, () => {
      assert(dotEnvConfig.error === undefined, "error accessing .env files");
   })

   it(`can log into Wordpress`, async () => {
      expect(WP_USERNAME, 'WP_USERNAME not in .env').to.be.a('string').and.not.empty;
      expect(WP_PASSWORD, 'WP_PASSWORD not in .env').to.be.a('string').and.not.empty;
      expect(WP_DOMAIN, 'WP_DOMAIN not in .env').to.be.a('string').and.not.empty;
      expect(
         validUrl(WP_DOMAIN), "WP_DOMAIN isn't a valid url"
      ).to.be.true;
      
      expect(validUrl(WP_DOMAIN), "WP_DOMAIN isn't a valid url").to.be.true;

      let TEST_SELECTOR = '#wp-admin-bar-my-account';
      
      await page.goto(`${WP_DOMAIN}/wp-admin`)
      let wpAdminBar = await page.$(TEST_SELECTOR);
      expect(wpAdminBar).to.be.null;

      await page.goto(`${WP_DOMAIN}/wp-login.php`)
      await page.type('#user_login', WP_USERNAME);
      await page.type('#user_pass', WP_PASSWORD);
      await page.click('#wp-submit');

      await page.waitForNavigation();
      const cookies = await page.cookies();
      expect(cookies).to.not.be.empty;

      const newPage = await browser.newPage();
      await newPage.setCookie(...cookies);
      await newPage.goto(`${WP_DOMAIN}/wp-admin`)
      wpAdminBar = await newPage.$(TEST_SELECTOR);
      expect(wpAdminBar).to.not.be.null;
   })
})