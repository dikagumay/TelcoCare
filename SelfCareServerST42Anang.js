// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

var filter = function(req, res, callback) {
    req.headers['host'] = req.headers['host'].replace('10.64.19.215:4200', '180.214.232.98:21084');
    callback(req, res);
}

// Get our API routes
const app = express();

// Doku Notify Page
app.use("/inbound/doku/notify", function(req, res) {
    console.log('call Page Doku Notify.');
    proxy.web(req, res, {
        target: 'http://10.64.18.249:8080/api/v1/inbound/doku/notify'
    });
});

// Doku Payment Page
app.use("/inbound/doku/thankyout", function(req, res) {
    console.log('call Page Doku Thankyou.');
    proxy.web(req, res, {
        target: 'http://10.64.18.249:8080/api/v1/inbound/doku/thankyou'
    });
});

// Doku Payment Page
app.use("/api/v1/inbound/close", function(req, res) {
    console.log('call Page Doku close.');
    res.redirect('http://180.214.232.98:21084/home');
});

//app.use("/api/v1/inbound/close", proxy({target: 'http://180.214.232.98:21084/home', changeOrigin: true}));

// Doku Payment Page
app.use("/payment-gateway/product", function(req, res) {
     console.log('call product purchase #edw');
     filter(req, res, function(req, res) {
          proxy.web(req, res, {
             target: 'http://10.64.18.249:8080/api/v1/payment-gateway/product'
          });
      });
});

// Doku Payment Page
  app.use("/api/v1/doku/dokubuy-cc", function(req, res) {
      
      console.log('call product purchase #edw');
       
      proxy.web(req, res, {
         target: 'http://10.64.18.249:8080/api/v1/doku/dokubuy-cc'
      });
  });

// Doku Payment Page
   app.use("/api/v1/doku/dokubuy-mandiri", function(req, res) {
          console.log('call product purchase #edw');
                   proxy.web(req, res, {
                                  target: 'http://10.64.18.249:8080/api/v1/doku/dokubuy-mandiri'
                                       });
                                         });

   app.use("/api/v1/doku/dokubuy-bri", function(req, res) {
          console.log('call product purchase #edw');
                   proxy.web(req, res, {
                                  target: 'http://10.64.18.249:8080/api/v1/doku/dokubuy-bri'
                                       });
                                         });



// Fusion API Call
app.use("/api", function(req, res) {
    console.log('call API fusion. testing');
    if(typeof req.headers['x-msp-msisdn'] != 'undefined') {
      var msisdn = req.headers['x-msp-msisdn'];
      delete req.headers['x-msp-msisdn'];
      req.headers['X-MSP-MSISDN'] = msisdn;
    }
    proxy.web(req, res, {
        target: 'http://10.64.18.249:8080/api/v1/'
    });
});

// Chat API Call
app.use("/chat", function(req, res) {
    console.log('call Chat fusion.');
    proxy.web(req, res, {
        target: 'http://10.103.84.13:8081/'
    });
});


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// testing page
app.get('/testing', function (req, res) {
	req.headers['X-MSP-MSISDN'] = typeof req.headers['x-msp-msisdn'] != 'undefined' ? req.headers['x-msp-msisdn'] : '';
	console.log('testing page call');
	console.log(req.headers);
	console.log('-----------------------------------');
	console.log(req.rawHeaders);
	console.log('-----------------------------------');
	res.send('Your number : ' + req.headers['X-MSP-MSISDN']);
});

// ping page
app.get('/ping', function (req, res) {
	console.log('ping pong page');
	res.send('pong');
});

// Catch all other routes and return the index file
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4200';
app.set('port', port);
/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Selfcare Server running on localhost:${port}`));