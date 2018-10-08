
import puppeteer from 'puppeteer';
import {expect} from 'chai';
import {
   TEST_TIMEOUT,
   WP_USERNAME,
   WP_PASSWORD,
   WP_DOMAIN
} from './constants';


describe.only('Wordpress login process', function(){
   this.timeout(TEST_TIMEOUT);

   var browser, page;

   beforeEach(async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
   })

   afterEach(async () => {
      await browser.close();
   })

   it(`can log into Wordpress`, async () => {
      if (!WP_USERNAME || !WP_PASSWORD){
         throw new Error('Wordpress credentials not specified in constants.');
      }
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