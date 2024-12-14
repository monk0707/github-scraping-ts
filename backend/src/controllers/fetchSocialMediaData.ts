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
        // .addArguments(`--proxy-server=http://${proxyAuth}@${proxyAddress}`)

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions)
            .build();

        // if (url.includes('linkedin.com')) {
        //     await loginToLinkedIn(driver);
        // }

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
            content: text,
            url: url,
            status: 200,
            statusText: 'OK'
        };

    } catch (error) {

        console.error('Error fetching the URL:', error);
        return {
            content: null,
            url: url,
            status: 500,
            statusText: error,
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

    console.log('just reached in batchpipelineSelenium');
    const seleniumResponses = await Promise.all(urlsToScrape.map((url) => pipeline(url, selectOneProxyUrl(proxyList))));

    // let successfulResponses = responses.filter((response) => response.status === 200);
    // let unsuccessfulResponses = responses.filter((response) => response.status !== 200);

    // // removeSuccessfulUrls(urlsToScrape, successfulResponses);

    // unsuccessfulResponseQueue = unsuccessfulResponses;

    // what can I do now : 



    return { seleniumResponses };
}







// import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
// import { Builder, By, until } from 'selenium-webdriver';
// import 'chromedriver';
// import { Options } from 'selenium-webdriver/chrome';
// import cheerio from 'cheerio';



// if (isMainThread) {
//     // Main thread: Export the function to run the worker
// //     const run = async () => {
// // // await batchPipelineSelenium()

// //     }
// //     run();

//  const batchPipelineSelenium = async (urlsToScrape: string[], proxyList: string[]) => {
//     return new Promise((resolve, reject) => {
//         const worker = new Worker(__filename, {
//             workerData: { urlsToScrape, proxyList },
//         });

//         worker.on('message', (result) => resolve(result));
//         worker.on('error', reject);
//         worker.on('exit', (code) => {
//             if (code !== 0) {
//                 reject(new Error(`Worker stopped with exit code ${code}`));
//             }
//         });
//     })
// };
// } else {
//     // Worker thread: Process the task

//     const list = workerData.proxyList;

// async function parseUrl(url: string) {
//     const arr = url.split('@');

//     const auth = arr[0];
//     const address = arr[1];

//     return {
//         proxyAddress: address,
//         proxyAuth: auth
//     };
// }

// async function loginToLinkedIn(driver: any) {
//     const username = process.env.LINKEDIN_USERNAME;
//     const password = process.env.LINKEDIN_PASSWORD;

//     await driver.get('https://www.linkedin.com/uas/login');
//     await driver.findElement(By.id('username')).sendKeys(username);
//     await driver.findElement(By.id('password')).sendKeys(password);
//     await driver.findElement(By.xpath("//button[@type='submit']")).click();

//     // Wait for the login to complete
//     await driver.wait(until.urlContains('feed'), 1500);
// }

// async function fetchAndParse(url: string, proxy: { proxyAddress: string, proxyAuth: string }) {
//     let driver;
//     try {
//         const proxyAddress = proxy.proxyAddress;
//         const proxyAuth = proxy.proxyAuth;



//         const chromeOptions: any = new Options()
//             .addArguments('--headless')
//             .addArguments('--disable-gpu')
//             .addArguments('--no-sandbox');

//         driver = await new Builder()
//             .forBrowser('chrome')
//             .setChromeOptions(chromeOptions)
//             .build();

//         await driver.get(url);

//         // Wait for the page to load and display the title
//         await driver.wait(until.titleIs('expected title'), 10000);

//         const body = await driver.findElement(By.tagName('body')).getAttribute('innerHTML');
//         const $ = cheerio.load(body);

//         $('.footer, .ad-container').remove();
//         $('script, style').remove();
//         let text = $('body').text();

//         console.log($('title').text());

//         return {
//             content: text,
//             url: url,
//             status: 200,
//             statusText: 'OK'
//         };

//     } catch (error) {
//         console.error('Error fetching the URL:', error);
//         return {
//             content: null,
//             url: url,
//             status: 500,
//             statusText: error,
//         };
//     } finally {
//         if (driver) {
//             await driver.quit();
//         }
//     }
// }

// function selectOneProxyUrl(list: string[]) {
//     const rand = Math.floor(Math.random() * list.length);
//     return list[rand];
// }

// async function pipeline(urlToScrape: string, proxyUrl: string) {
//     const obj = await parseUrl(proxyUrl);
//     return fetchAndParse(urlToScrape, obj);
// }

//     async function runPipeline(urlsToScrape: string[], proxyList: string[]) {
//         const seleniumResponses = await Promise.all(
//             urlsToScrape.map((url) => pipeline(url, selectOneProxyUrl(proxyList)))
//         );

//         return { seleniumResponses };
// }

//     // Run the pipeline and send the result back to the main thread
//     runPipeline(workerData.urlsToScrape, workerData.proxyList)
//         .then((result) => {
//             if (parentPort) {
//                 parentPort.postMessage(result);
//             }
//         })
//         .catch((error) => {
//             console.error('Error in worker thread:', error);
//             if (parentPort) {
//                 parentPort.postMessage({ error: error.message });
//             }
//         });
// }
