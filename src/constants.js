import dotenv from 'dotenv';
const dotEnvConfig = dotenv.config();
let {
   TEST_URL
} = process.env;


export const TEST_TIMEOUT = 30000;

export let URLS = [];
if (TEST_URL){
   URLS.push(TEST_URL);
}

export const SCREENSHOTS_FOR = [
   'iPhone 6',
   'iPad Pro landscape',
   'Galaxy S5'
];
