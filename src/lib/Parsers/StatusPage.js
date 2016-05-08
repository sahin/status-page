const jsdom = require('jsdom');
const c = require('../Common/Console.js');

export function parseStatusCurrent($, serviceCurrent) {
  const service = serviceCurrent;

  service.status.description = $('.page-status span.status').text().trim();

  if (service.status.description === 'All Systems Operational') {
    service.status.indicator = 'Operational';
    service.status.color = 'green';
  } else {
    if ($('.page-status').length > 0) {
      const desc = $('.page-status').attr('class');
      c.log('page-status', desc);
      if (desc.indexOf('status-minor') > -1) {
        service.status.indicator = 'Minor';
      } else if (desc.indexOf('status-major') > -1) {
        service.status.indicator = 'Major';
      }
    }

    if ($('.unresolved-incidents').length > 0) {
      const text = $('.unresolved-incidents').html();
      c.log('unresolved-incidents');

      if (text.indexOf('impact-major') > -1) {
        service.status.indicator = 'Major';
      } else if (text.indexOf('impact-minor') > -1) {
        service.status.indicator = 'Minor';
      } else if (text.indexOf('impact-none') > -1) {
        service.status.indicator = 'Non impact';
      }
    }

    if (service.status.indicator === 'Major') {
      service.status.description = 'Major incident';
      service.status.color = 'red';
    } else if (service.status.indicator === 'Minor') {
      service.status.description = 'Minor incident';
      service.status.color = 'yellow';
    } else if (service.status.indicator === 'Non impact') {
      service.status.description = 'Non impact incident';
      service.status.color = 'black';
    } else {
      service.status.indicator = 'Unknown';
      service.status.description = 'Unknown incident';
      service.status.color = 'black';
    }
  }
}

export function parseProvider($, serviceCurrent) {
  const service = serviceCurrent;
  if ($('.powered-by').text().trim() === 'Powered by StatusPage.io') {
    service.provider = 'StatusPage.io';
  } else {
    service.provider = 'Unknown';
  }
}

export async function parse(url) {
  return new Promise((resolve) => {
    // clog('-----------', 'Parsing Started for ', url, '-----------');
    const service = {
      // 'name': null,
      // 'readable_name': null,
      url: null,
      provider: null,
      status: {
        indicator: null,
        description: null,
        updated_at: null,
        color: null,
      },
    };

    jsdom.env(
      url,
      ['http://code.jquery.com/jquery.js'],
      (err, window) => {
        const $ = window.$;

        service.url = url;
        parseProvider($, service);
        parseStatusCurrent($, service);

        service.status.updated_at = new Date().toISOString();
        resolve(service);

        // clog('-----------', 'JSDOM', '-----------', service);
      });
  });
}

/* async function test() {
  const url = 'https://status.airbrake.io';
  const service = await parse(url);
  clog('-----------', 'test results', '-----------', service);
} */


// test()
