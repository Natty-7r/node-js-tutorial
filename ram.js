const os = require('node:os');

// console.log(os.endianness());
// console.log(os.cpus());
// console.log(os.freemem() / 1024 / 1024 / 1024, 'Gb');
console.log(os.hostname());
console.log(os.homedir());
console.log(os.tmpdir());
console.log(os.networkInterfaces());
console.log(os.platform());
console.log(os.release());
console.log(os.totalmem() / 1024 ** 3);
console.log(os.uptime(), 'time');
console.log(os.userInfo());
console.log(os.version());
console.log(os.machine, 'macine');
// console.log(os.constants);
