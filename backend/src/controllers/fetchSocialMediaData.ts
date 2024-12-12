const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const chrome = require('selenium-webdriver/chrome');
const cheerio = require('cheerio');

// let unsuccessfulResponseQueue = [];

let list = process.env.PROXY_LIST;

async function parseUrl(url: string) {
    const arr = url.split('@');

    const auth = arr[0];
    const address = arr[1];

    let obj = {
        proxyAddress: address,
        proxyAuth: auth
    };

    return obj;
}

async function loginToLinkedIn(driver: any) {
    const username = process.env.LINKEDIN_USERNAME;
    const password = process.env.LINKEDIN_PASSWORD;

    const responseLogin = await driver.get('https://www.linkedin.com/uas/login');
    console.log('response from login page is ', responseLogin);

    // await driver.sleep(2000);

    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.xpath("//button[@type='submit']")).click();

    // Wait for the login to complete   
    await driver.wait(until.urlContains('feed'), 1500);
}

async function fetchAndParse(url: string, proxy: { proxyAddress: string, proxyAuth: string }) {
    let driver;
    try {
        const proxyAddress = proxy.proxyAddress;
        const proxyAuth = proxy.proxyAuth;

        // const chromeOptions = new chrome.Options()
        //     .addArguments('--headless') // Run Chrome in headless mode
        //     .addArguments('--disable-gpu') // Disable GPU rendering (recommended for headless)
        //     .addArguments('--no-sandbox') // Required in some environments
        //     .addArguments('--disable-dev-shm-usage') // Prevent resource issues in Docker
        //     .addArguments(`--proxy-server=http://${proxyAddress}`);

        const chromeOptions = new chrome.Options()
            .addArguments('--headless')
            .addArguments('--disable-gpu')
            .addArguments('--no-sandbox')
            .addArguments(`--proxy-server=http://${proxyAuth}@${proxyAddress}`)

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions)
            .build();

        if (url.includes('linkedin.com')) {
            await loginToLinkedIn(driver);
        }

        await driver.get(url);

        // Wait for the page to load and display the title
        await driver.wait(until.titleIs('expected title'), 10000);

        const body = await driver.findElement(By.tagName('body')).getAttribute('innerHTML');
        const $ = cheerio.load(body);

        $('.footer, .ad-container').remove();
        $('script, style').remove();
        let text = $('body').text();

        console.log($('title').text());

        return {
            status: 200,
            message: 'OK',
            data: text,
            url: url
        };

    } catch (error) {

        console.error('Error fetching the URL:', error);
        return {
            status: 500,
            message: error,
            data: null,
            url: url
        };
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}
function selectOneProxyUrl(list: string[]) {
    const rand = Math.floor(Math.random() * list.length);
    const oneProxy = list[rand];

    return oneProxy;
}

async function pipeline(urlToScrape: string, proxyUrl: string) {
    const obj = await parseUrl(proxyUrl);
    const response = await fetchAndParse(urlToScrape, obj);

    console.log("response from pipeline is ", response);

    return response;
}

// removing the successful urls from all the urls which are being processed successful.

// async function removeSuccessfulUrls(urlsToScrape, successfulResponses) {
//     const successfulUrls = successfulResponses.map((response) => response.url);

//     return urlsToScrape.filter((url) => !successfulUrls.includes(url));

// }


export const batchPipelineSelenium = async function batchPipelineSelenium(urlsToScrape: string[], proxyList: string[]) {
    const socialMediaResponses = await Promise.all(urlsToScrape.map((url) => pipeline(url, selectOneProxyUrl(proxyList))));

    // let successfulResponses = responses.filter((response) => response.status === 200);
    // let unsuccessfulResponses = responses.filter((response) => response.status !== 200);

    // // removeSuccessfulUrls(urlsToScrape, successfulResponses);

    // unsuccessfulResponseQueue = unsuccessfulResponses;


    return { socialMediaResponses };
}

