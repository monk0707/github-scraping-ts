import { parentPort, workerData } from 'worker_threads';
import { batchPipelineSelenium } from './fetchSocialMediaData'; // import your batchPipelineSelenium function

// This is the worker function that will run on the worker thread
async function runSeleniumScraping() {
    try {

        console.log('just reached inside runSeleniumScraping function');

        const { urlsToScrape, proxyList } = workerData;

        // Run the batch pipeline in the worker thread
        const response = await batchPipelineSelenium(urlsToScrape, proxyList);

        // Send back the result to the main thread
        parentPort?.postMessage({ status: 'success', response });
    } catch (error) {

        parentPort?.postMessage({ status: 'error', error: error });
    }
}

// Start the scraping process when the worker starts
runSeleniumScraping();
