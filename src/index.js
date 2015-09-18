var SimplePeer = require('simple-peer');
var inherits = require('inherits');

function Peer(options) {
  SimplePeer.call(this, options);
}

inherits(Peer, SimplePeer);


module.exports = Peer;

