const Github = require('github-api');
const merge = require('merge');
const colors = require('colors');

const config = require('../../config.js');
const c = require('./Common/Console.js');
const Parser = require('./Parsers/Parser.js');
const GithubApi = require('./GithubApi.js');

export async function editReadmeForService(service) {
  const github = new Github(config.github);

  const repo = github.getRepo('sahin', 'status-page');

  const options = {
    author: { name: 'Sahin Boydas', email: 'sahinboydas@gmail.com' },
    committer: { name: 'Sahin Boydas', email: 'sahinboydas@gmail.com' },
    encode: true, // Whether to base64 encode the file. (default: true)
  };

  repo.contents('master', 'README.md', (err, contents) => {
    let regex = new RegExp(`${service.readable_name}-(.*).svg`, 'g');
    // console.log(regex);

    let string = `${service.readable_name}-${service.status.indicator}-` +
    `${service.status.color}.svg`;
    // console.log(string);

    let content = new Buffer(contents.content, 'base64').toString('ascii');

    let found = content.match(regex);
    if (found === string) {
      // clog('no change: skip readme update')
    } else {
      c.log('readme update');

      content = content.replace(regex, string);
      // var found = content.match(regex);
      // console.log('After');
      // console.log(found);
      // console.log(text);

      const message = `Update Readme for ${service.name} ${service.status.updated_at}`;
      // clog(message);
      const file = 'README.md';
      // clog(file);

      // Changing updated_at
      string = `Last Update ${service.status.updated_at}  PST`;
      regex = new RegExp('Last Update (.*) PST', 'g');
      found = content.match(regex);
      if (found === regex) {
        throw new Error('Time cannot found');
      } else {
        c.log('Updating time');
        content = content.replace(regex, string);
      }

      repo.write('master', file, content, message, options, (error) => {
        if (!error) {
          // clog('Commited');
        } else {
          c.error(error);
        }
      });
    }
    // console.log(found);
  });
}

export async function edit(service) {
  const message = `Update ${service.name} ${service.status.updated_at}`;
  const statusFile = `services/${service.name}/status.json`;
  const content = JSON.stringify(service, null, 2);
  await GithubApi.edit(statusFile, message, content);
}

export async function update(serviceName) {
  try {
    const oldStatus = await GithubApi.fileContentsAsJson(`services/${serviceName}/status.json`);
    // clog('URL of the Status Page', oldStatus.url);
    // clog('oldStatus', oldStatus);
    const currentStatus = await Parser.parse(oldStatus.provider, oldStatus.url);
    // clog('currentStatus', currentStatus);

    if (oldStatus.status.indicator !== currentStatus.status.indicator) {
      const status = merge(oldStatus, currentStatus);

      c.log('Name', currentStatus);
      c.log('oldStatus.status.indicator', oldStatus.status.indicator);
      c.log('currentStatus.status.indicator', currentStatus.status.indicator);
      c.log('=============', colors.red(`status changed ${status.name}`));

      await edit(status);
      await editReadmeForService(status);
    } else {
      c.log(colors.green('no change skip'));
    }
  } catch (error) {
    c.error(error);
    c.error(error.stack);
  }
}

export async function getAll() {
  return new Promise((resolve) => {
    // Github
    const github = new Github(config.github);
    const repo = github.getRepo('sahin', 'status-page');
    repo.contents('master', 'services', (err, contents) => {
      const folders = contents.filter(item => item.type === 'dir');
      const services = folders.map(item => item.name);
      resolve(services);
    });
  });
}

export async function updateAll() {
  const services = await getAll();

  for (const serviceName of services) {
    c.log('==============', serviceName);
    // await updateGithub(service_name)
    await update(serviceName);
  }
}

/*
export async function printServicesForReadme() {
  const services = await Github.getAll();

  for (const serviceName of services) {
    const service = await Service.currentStatus(serviceName);

    const text = `[![${service.readable_name}](https://img.shields.io/badge/${service.readable_name}-${service.status.indicator}-${service.status.color}.svg)](${service.url})`;

    clog(text);
    clog(' ');
  }
}
*/
