const Service = require('./lib/Service.js');
const c = require('./lib/Common/Console.js');

(async () => {
  try {
    await Service.updateAll();
    // await Service.update('lets-encrypt');
  } catch (error) {
    c.error(error);
    c.error(error.stack);
  }
})();
