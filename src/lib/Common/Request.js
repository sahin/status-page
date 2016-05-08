const request = require('request');
const c = require('./Console.js');

request.requestAsHTML = async (url) => {
  c.log('Request URL', url);
  return new Promise((resolve) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      }
    });
  });
};

export function requestAsHTML(url) {
  return new Promise((resolve) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      }
    });
  });
}

export function requestAsJson(url) {
  return new Promise((resolve) => {
    request(url, (error, response, body) => {
      resolve(JSON.parse(body));
    });
  });
}

export default request;
