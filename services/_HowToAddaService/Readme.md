Our system supports StatusPage.io and Upcoming Status.io, so check the template file and simple create a folder with system.json.


If your service has a custom in house status page,

1) Create a folder and status.json file from the template.json

2) Create a file called Parse.js (example check Statusio.js) for parsing I suggest cheerio, jsdom or scrape-it 

It should have

```
export async function parse(url) {
  return new Promise((resolve) => {
    const service = {
      status: {
        description: '',
        indicator: 'Operational',
        color: 'green',
      }
    };

    // your code

    service.status.updated_at = new Date().toISOString();

    resolve(service);
  });
}

```

the service object will be merged the status.json so no worry about the remaing things like name, statuspage etc etc
