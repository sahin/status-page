const StatusPage = require('./StatusPage.js');
const Statusio = require('./Statusio.js');

export async function parse(provider, url) {
  let status = null;
  if (provider === 'StatusPage.io') {
    status = await StatusPage.parse(url);
  } else if (provider === 'Powered by Status.io') {
    status = await Statusio.parse(url);
  } else {
    throw new Error('Not implemented Provider');
  }
  return status;
}
