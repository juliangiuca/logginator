const express = require('express')
const puppeteer = require('puppeteer');
var morgan = require('morgan')
const URL = require('url').Url;

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3();
const app = express()
const port = process.env.PORT || 3000

app.use(morgan('combined'))

app.get('/', (req, res) => {
  let targetUrl = req.query.url;

  hitWebsite(targetUrl)

  res.send(`completed request for ${targetUrl}`)

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function hitWebsite(targetUrl) {
  const myURL = new URL(targetUrl);
  console.log('triggering request for', targetUrl)

  var timeInMs = Date.now();
  let name = `${timeInMs}-${myURL.host}.png`

  console.log('spinning up chrome for', targetUrl)

  puppeteer.launch().then(browser => {
  browser.newPage()
    .then(page => {
      page.goto(targetUrl, {waitUntil: 'load', timeout: 10000})
        .then(resp   => page.screenshot({fullPage: true}))
        .then(buffer => upload({ Body: buffer, Bucket: "logginator", Key: name }))
        .then(() => browser.close())
        .catch((err) => {
            console.error('something went wrong', err)
        })
    });
  });

}

let upload = (params) => {
  return new Promise((resolve, reject) => {
    console.log('uploading to s3')

    s3.putObject(params, function(err, data) {
      if (err) reject(err, err.stack); // an error occurred
      else     resolve(data);           // successful response
    });
  })
}
