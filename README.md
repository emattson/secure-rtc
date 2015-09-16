<img src="img/slide_right.png" style="width:25%;  border:none;" align="right" />
# secure-rtc
Simple pgp encrypted WebRTC data channels


##Features
* **Secure**, node.js style WebRTC API
* works in browser and node programs
* supports **data-channel**
* uses **PGP** RSA or AES encryption schemes 
##Quick Start
```
npm install secure-rtc
```

##Usage
```js
var Peer = require('secure-rtc');
var p = new Peer({ initiator: location.hash === '#1', secret: 'shhhhh this is your secret key seed', trickle: false });

p.on('error', function (err) { console.log('error', err) });

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data);
});

document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault();
  p.signal(JSON.parse(document.querySelector('#incoming').value));
});

p.on('connect', function () {
  console.log('CONNECT');
  p.send('whatever' + Math.random());
});

p.on('data', function (data) {
  console.log('data: ' + data);
});
```