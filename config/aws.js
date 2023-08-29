const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AKIAYourAccessKey,
    secretAccessKey: process.env.YourSecretAccessKey,
    region: process.env.Region
});

module.exports = AWS;
