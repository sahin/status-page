const scrapeIt = require('scrape-it');
const c = require('../Common/Console.js');

export function parseStatusCurrent(serviceCurrent) {
  const service = serviceCurrent;

  if (service.status.description === 'All Systems Operational') {
    service.status.indicator = 'Operational';
    service.status.color = 'green';
  } else if (service.status.description.indexOf('minor') > -1) {
    service.status.indicator = 'Minor';
    service.status.color = 'yellow';
  } else if (service.status.description.indexOf('major') > -1) {
    service.status.indicator = 'Major';
    service.status.color = 'red';
  } else {
    service.status.indicator = 'Unknown';
    service.status.color = 'black';
  }
}

export async function parse(url) {
  return new Promise((resolve) => {
    // Callback interface
    scrapeIt(url, {
      // $('')
      provider: {
        selector: '#statusio_branding',
        how: 'text',
      },
      status: {
        data: {
          description: {
            selector: '#statusio_status_bar .col-md-8',
            how: 'text',
          },
        },
      },
    }, (err, service) => {
      c.error(err);
      parseStatusCurrent(service);
      service.status.updated_at = new Date().toISOString();
      resolve(service);
    });
  });
}
