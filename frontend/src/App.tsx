import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FetchResult { content: string, url: string, status: number, statusText: string }

const App = () => {
  const [data, setData] = useState<FetchResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001');
        const data: { urls: string[] } = await response.json();
        const urls: string[] = data.urls;

        console.log('all urls are ', urls);

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

  const fetchDataFromFrontend = async () => {
    const filteredData = data.filter(item => item.status === 0 || item.status === 500);
    if (filteredData.length === 0) {
      console.log('No data with status 0 to fetch');
      return;
    }

    const promises = filteredData.map(item => fetchUrlData(item.url));
    const results = await Promise.all(promises);

    const updatedData = data.map(item => {
      const res = results.find(res => res.url === item.url);
      if (res) {
        return res;
      }
      return item;
    });

    alert('Data fetched from frontend successfully');

    setData(updatedData);
    };


  // function to update data by other urls 

  const updateDataOtherUrls = async (resFromOtherUrls: FetchResult[]) => {
    if (resFromOtherUrls.length === 0) {
      return;
    }
    const updatedData = data.map(item => {
      const res = resFromOtherUrls.find(res => res.url === item.url);
      if (res) {
        return res;
      }
      return item;
    });

    setData(updatedData);
  }

  // function to update data by social media urls

  const updateDataSocialMediaUrls = async (resFromSocialMediaUrls: FetchResult[]) => {
    console.log('resFromSocialMediaUrls is :', resFromSocialMediaUrls);
    if (resFromSocialMediaUrls.length === 0) {
      console.log('No data from social media urls');
      return;
    } else {
      const updatedData = data.map(item => {
        const res = resFromSocialMediaUrls.find(res => res.url === item.url);
        if (res) {
          return res;
        }
        return item;
      });

      setData(updatedData);
    }
  }

  const sendDataToBackend = async () => {
    try {
      const unfetchedUrls = data.map(item => ({ content: "", url: item.url, status: item.status, statusText: item.statusText }));
      const response = await axios.post('http://localhost:3001/augment', { results: unfetchedUrls });
      console.log('Response from backend:', response.data.otherUrls);

      const resFromOtherUrls = response.data.otherUrls;
      // const resFromSocialMediaUrls = response.data.socialMediaUrls;

      alert('Data sent successfully');

      updateDataOtherUrls(resFromOtherUrls);
      // updateDataSocialMediaUrls(resFromSocialMediaUrls);

    } catch (err) {
      if (err instanceof Error) {
        alert('Failed to send data');
      }
      else {
        alert('Failed to send data');
      }
    }
  };



  const sendDataToSelenium = async () => {
    try {
      const unfetchedUrls = data.map(item => ({ content: "", url: item.url, status: item.status, statusText: item.statusText }));

      console.log('sending data to selenium still in frontend');

      const res = await fetch('http://localhost:3001/scrapeSelenium', { body: JSON.stringify({ results: unfetchedUrls }) });
      const response = await res.json();
      console.log('Response from backend:', response.otherUrls);

      const resFromOtherUrls = response.data.otherUrls;
  // const resFromSocialMediaUrls = response.data.socialMediaUrls;

      alert('Data sent successfully');

      updateDataOtherUrls(resFromOtherUrls);
      // updateDataSocialMediaUrls(resFromSocialMediaUrls);

    } catch (err) {
      if (err instanceof Error) {
        alert('Failed to send data');
        console.log('Failed to send data', err);
      }
      else {
        alert('Failed to send data');
        console.log('Failed to send data', err);
      }
    }
  };

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(data.map(entry => ({ ...entry, content: undefined })), null, 2)}</pre>
      <button onClick={fetchDataFromFrontend}>Reiterate from frontend</button>
      <button onClick={sendDataToBackend}>Send Data to Backend</button>
      <button onClick={sendDataToSelenium}>Send Data to Selenium</button>
    </div>
  );
};

export default App;
