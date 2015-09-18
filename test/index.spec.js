var Peer = require('../src/index');
var SimplePeer = require('simple-peer');

describe('simple-rtc', function() {
  it('should inherit properties from simple-peer', function() {
    var peer = new Peer();
    var simplePeer = new SimplePeer();
    expect(peer).to.contain.all.keys(Object.keys(simplePeer))
  });
});