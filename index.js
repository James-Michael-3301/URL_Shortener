require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const dns = require('dns');
let urls = [];
let shortUrl = 1;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  try {
    const url = new URL(originalUrl);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }

    dns.lookup(url.hostname, function(err) {
      if (err) {
        return res.json({ error: 'invalid url' });
      }

      const newUrl = {
        original_url: originalUrl,
        short_url: shortUrl
      };

      urls.push(newUrl);
      shortUrl++;

      res.json(newUrl);
    });
  } catch (err) {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const short = Number(req.params.short_url);

  const url = urls.find(function(item) {
    return item.short_url === short;
  });

  if (url) {
    res.redirect(url.original_url);
  } else {
    res.json({ error: 'URL not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
