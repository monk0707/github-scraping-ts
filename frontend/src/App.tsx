import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FetchResult { content: string, url: string, status: number, statusText: string }

const App = () => {
  const [data, setData] = useState<FetchResult[]>([]);

  useEffect(() => {
    // console.log('entering the useeffect function ');
    // let headers = new Headers();

    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');

    // headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    // headers.append('Access-Control-Allow-Credentials', 'true');

    // headers.append('GET', 'POST', 'OPTIONS');

    // headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));


    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001');
        const data: { urls: string[] } = await response.json();
        const urls: string[] = data.urls;

        console.log('all urls are ', urls);

        const fetchUrlData = async (url: string) => {
          try {
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');

            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');

            const response = await fetch(url, {
              method: 'GET',
            });
            const result = await response.text();

            return { content: result, url, status: response.status, statusText: response.statusText };
          } catch (err) {
            if (err instanceof Error) {
              return { content: "No content found", url, status: 0, statusText: err.message };
            } else {
              return { content: "No content found", url, status: 0, statusText: "Unknown error" };
            }
          }
        };

        const promises = urls.map(url => fetchUrlData(url));
        const results = await Promise.all(promises);

        setData(results);
        console.log('fetched data is ', results);
      } catch (error) {
        console.log('in the error block');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
