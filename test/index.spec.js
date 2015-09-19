var Peer = require('../src/index');
var SimplePeer = require('simple-peer');

describe('secure-rtc', function() {
  describe('webrtc', function() {
    it('should inherit properties from simple-peer', function () {
      var peer = new Peer();
      expect(peer).to.be.an('object');
      expect(peer instanceof SimplePeer).to.be.ok;
    });
  });

  describe('key generation', function() {
    it('_generateKeys should express that it has a public/private keypair', function() {
      var peer = new Peer({id: 'my super id'});
      peer._generateKeys(function() {
        expect(peer._hasKeys).to.be.ok;
        done();
      }.bind(peer));
    });

    it('should call _generateKeys if a public key is not provided in options', function() {
    });

    it('should provide an asp', function() {
    });

  });
});