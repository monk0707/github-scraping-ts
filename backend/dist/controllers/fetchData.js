const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
async function normalFetch(url) {
    try {
        const response = await axios.get(url, { timeout: 10_000 });
        if (response.status !== 200) {
            return {
                content: null,
                url: url,
                status: response.status,
                statusText: response.statusText
            };
        }
        const body = response.data;
        // const text = await parseHtml(body);
        // Use the $ operator to parse and manipulate the HTML
        // console.log($('title').text());
        return {
            content: body,
            url: url,
            status: response.status,
            statusText: response.statusText
        };
    }
    catch (error) {
        console.error('Error fetching the URL:', error);
        return {
            content: null,
            url: url,
            status: 500,
            statusText: 'Internal Server Error'
        };
    }
}
async function socialMediaFetch(url) {
    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            return {
                content: null,
                url: url,
                status: response.status,
                statusText: response.statusText
            };
        }
        const body = response.data;
        // const text = await parseHtml(body);
        // Use the $ operator to parse and manipulate the HTML
        // console.log($('title').text());
        return {
            content: body,
            url: url,
            status: response.status,
            statusText: response.statusText
        };
    }
    catch (error) {
        console.error('Error fetching the URL:', error);
        return {
            content: null,
            url: url,
            status: 500,
            statusText: 'Internal Server Error'
        };
    }
}
export const batchPipelineFetch = async function batchPipelineFetch(urlsToScrape) {
    // const socialMediaUrls = urlsToScrape.filter(url => {
    //     return ['linkedin.com', 'g2.com', 'reddit.com'].some(domain => url.includes(domain));
    // });
    // const otherUrls = urlsToScrape.filter(url => {
    //     return !['linkedin.com', 'g2.com', 'reddit.com'].some(domain => url.includes(domain));
    // });
    const responses = await Promise.all(urlsToScrape.map((url) => normalFetch(url)));
    // const proxyList = process.env.PROXY_LIST ? process.env.PROXY_LIST.split(',') : [];
    // const socialMediaResponses = batchPipelineSelenium(socialMediaUrls, proxyList);
    return { responses };
};
