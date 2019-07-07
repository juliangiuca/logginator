const express = require('express')
const puppeteer = require('puppeteer');
var morgan = require('morgan')
const url = require('url')



const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3();
const app = express()
const port = 3000

app.use(morgan('combined'))

app.get('/', (req, res) => {
  let targetUrl = req.query.url;
  const myURL = new URL(targetUrl);

  (async () => {
    console.log('triggering request for', targetUrl)

    var timeInMs = Date.now();
    let name = `${timeInMs}-${myURL.host}.png`

    console.log('spinning up chrome for', targetUrl)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(targetUrl);
    let img = await page.screenshot({fullPage: true});
    console.log('got screenshot for', targetUrl)

    var params = {
      Body: img,
      Bucket: "logginator",
      Key: name
    };

    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });

    await browser.close();
    await res.send(`completed request for ${targetUrl}`)
  })();

  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
