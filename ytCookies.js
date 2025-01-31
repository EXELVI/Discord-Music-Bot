const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

const ENV = process.env;

const stealth = StealthPlugin();
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('media.codecs');
puppeteer.use(stealth);

async function ytCookies() {
  if (!ENV.googlMail || !ENV.googlPass) {
    console.warn('⚠️ googlMail or googlPass are wrong or not provided');
    return;
  }

  console.log('ℹ️ Trying to fetch cookie from Google Auth, this might take some time');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/brave-browser",
    args: ['--no-sandbox']
  });
  console.log('✅ Browser launched');
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('https://www.youtube.com', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'test.png' });
  console.log('✅ Navigated to YouTube');
  try {
    await page.click(
      '#topbar > div.top-buttons.style-scope.ytd-consent-bump-v2-lightbox > div:nth-child(2) > ytd-button-renderer > yt-button-shape > a'
    );
  } catch {
    await page.click('#buttons > ytd-button-renderer > yt-button-shape > a');
  }

  await page.waitForSelector('#identifierId', { visible: true });
  await page.type('#identifierId', ENV.googlMail);
  await page.click('#identifierNext');

  await page.screenshot({ path: 'test1.png', fullPage: true });
  console.log('✅ Entered email');

  await page.waitForSelector('#password', { visible: true });
  await page.type('#password input', ENV.googlPass);
  await page.evaluate((selector) => document.querySelector(selector).click(), '#passwordNext');

  await page.screenshot({ path: 'test2.png', fullPage: true });
  console.log('✅ Entered password');

  try {
    const NotNowSelector =
      '#yDmH0d > c-wiz:nth-child(9) > div > div > div > div.L5MEH.Bokche.ypEC4c > div.lq3Znf > div:nth-child(1) > button > span';
    await page.waitForSelector(NotNowSelector, { timeout: 10000 });
    await page.screenshot({ path: 'test3.png', fullPage: true });
    console.log('✅ Found Not Now button');
    await page.click(NotNowSelector);
  } catch {
    await page.screenshot({ path: 'test4.png', fullPage: true });
    await page.goto('https://www.youtube.com', { waitUntil: 'networkidle2' });
    console.log('✅ Navigated to YouTube');
  }

  await page.screenshot({ path: 'test5.png', fullPage: true });
 
  const cookies = await page.cookies();
  await browser.close();

  if (cookies.length < 10) {
    console.error('❌ Something went wrong during authentication to Google');
    return undefined;
  }

  const cookiesJson = JSON.stringify(cookies, null, 2);
  fs.writeFileSync('yt-cookies.json', cookiesJson);

  if (!cookies) console.error('❌ Failed to fetch YouTube cookies');
  if (cookiesJson) console.log('✅ YouTube Cookies fetched successfully');

  return cookies;
}

module.exports = { ytCookies };
