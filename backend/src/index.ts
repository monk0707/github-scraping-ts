


import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// import { scrapeUrls } from './controllers/scrapeUrls';
// import scrapeRoutes from './routes/scrapeRoutes';
// import database from './config/database';
// const { parseHtml } = require('./fetch.js');

dotenv.config();

// database.connect();

const app = express();
const port:number = parseInt(process.env.PORT || '3001',10);

// app.use(cors({
//     origin: 'http://localhost:3000', // Your frontend URL
//     methods: ['GET', 'POST']
//   }));

app.use(cors());

app.use(bodyParser.json()); 


app.get("/", (req : Request, res : Response) => {
    res.json({ 
        urls: [
        "https://getalchemystai.com/", 
        "https://getalchemystai.com/",
        "https://getalchemystai.com/",
        "https://getalchemystai.com/",
        "https://getalchemystai.com/",
        "https://getalchemystai.com/",
        "https://getalchemystai.com/",
        "https://getalchemystai.com/",
        "https://getalchemystai.com/",
        "https://getalchemystai.com/",
        "https://www.artisan.co/",
        "https://www.ema.co/"
    ]
});

    // const response = scrapeUrls(req,res,urls);

    // res.json(response);
    res.json ({
        message: "successful",
    })
});

// app.use("/api/scrape", scrapeRoutes);

app.post("/augment", (req: Request, res : Response) => {
    /**
     * The body of the request should be an object with the following structure:
     * {
     *    results: [
     *     {
     *      url: string,
     *      content: string
     *     }
     *    ]
     * 
     * @type {{ results: { url: string, content: string }[] }}
     */
    const body: {results: {url: string, content: string}[]} = req.body;

    console.log("the urls are ", body);

    // bodyType = { results: [{ "url": string, "content", string}]}

    const socialMediaUrls = body.results.filter(result => {
        return ['linkedin.com', 'g2.com', 'reddit.com'].some(domain => result.url.includes(domain));
    });

    const otherUrls = body.results.filter(result => {
        return !['linkedin.com', 'g2.com', 'reddit.com'].some(domain => result.url.includes(domain));
    });

    // now we have to scrape social media urls and other urls separately. and send the results to the llm : 

    // const scrapableUrls = body.results.filter(result => { return result.url
    // .match(/(linkedin\.com|g2\.com)/);
    // });

    // const scrapedDataFromSearch = scrapableUrls.map(result => {
    //     return {...result, content: parseHtml(result.content)};
    // })

    // Now send it to the LLM for generating response.

    // const responses = scrapedDataFromSearch.map(result => {
    //     return llm.send(result.content);
    // });
});

// app.get('/alchemyst-ai/scrape',scrapeUrls);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
