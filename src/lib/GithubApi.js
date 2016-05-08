const Github = require('github-api');
const c = require('./Common/Console.js');
const Request = require('./Common/Request.js');
import config from '../../config.js';

export async function edit(file, message, content) {
  return new Promise((resolve) => {
    const github = new Github(config.github);

    const repo = github.getRepo('sahin', 'status-page');

    const options = {
      author: { name: 'Sahin Boydas', email: 'sahin@movielala.com' },
      committer: { name: 'Sahin Boydas', email: 'sahin@movielala.com' },
      encode: true, // Whether to base64 encode the file. (default: true)
    };

    repo.write('master', file, content, message, options, (err) => {
      if (!err) {
        c.log('Commited');
      } else {
        c.log('Errors', err);
      }
      resolve();
    });
  });
}

export async function fileContentsAsJson(path) {
  const url = `https://raw.githubusercontent.com/sahin/status-page/master/${path}?v=${new Date().toISOString()}`;
  // c.log(url);
  const status = await Request.requestAsJson(url);
  // c.log(service);
  return status;
}
