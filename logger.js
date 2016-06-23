var winston = require('winston'),
    fs = require('fs'),
    log_dir = './logs';

winston.emitErrs = true;

if (!fs.existsSync(log_dir)){
    fs.mkdirSync(log_dir);
}

module.exports = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/logs.log',
            //handleExceptions: true,
            json: true,
            maxSize: 5242880,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            //handleExceptions: true,
            json: false,
            colorize: true
        })
    ],

    exitOnError: true 
});