const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const data = {
    post : [
      {
        "hero": "Hero",
        "detail": "Lorem ipsum dolor sit amet, hero adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "source": "https://www.google.com/",
        "id": "dd15"
      },
      {
        "hero": "Dero",
        "detail": "dero Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "source": "https://www.google.com/",
        "id": "e2eb"
      },
      {
        "hero": "Zero",
        "detail": "Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum zero.",
        "source": "https://www.google.com/",
        "id": "2807"
      },
      {
        "hero": "Pero",
        "detail": "Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam pero, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "source": "https://www.google.com/",
        "id": "d7d4"
      }
    ]
  }

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/search', (req, res) => {
    const {query} = req.body;
    if (query.length === 0 || query === undefined) {
        res.json({
            result: []
        });
    } else if (query.length === 1) {
        res.json({
            result: data.post
        });
    } else if (query.length === 2 ) {
        res.json({
            result: data.post.filter(e => e.hero !== 'Zero' )
        });
    } else if (query.length === 3) {
        res.json({
            result: data.post.filter(e => e.hero !== 'Zero' && e.hero !== 'Hero')
        });
    } else {
        res.json({
            result: [data.post[0]]
        });
    }
});

app.listen(3000);