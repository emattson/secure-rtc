var Peer = require('../src/index');
var SimplePeer = require('simple-peer');
var kbpgp = require('kbpgp');
var utils = require('./utils');

describe('secure-rtc', function() {
  describe('webrtc', function() {
    it('should inherit properties from simple-peer', function () {
      var peer = new Peer();
      expect(peer).to.be.an('object');
      expect(peer).to.be.an.instanceof(SimplePeer);
    });
  });

  describe('key generation', function() {

    it('should generate a PGP key pair', function() {
      var peer = new Peer();
      peer.generateKeys('new id', function(km) {
        expect(km).to.be.an.instanceof(kbpgp.KeyManager);
        done();
      });
    });

    it('should be able to import keys', function() {
      var peer = new Peer();
      peer.importKey(utils.publicKey, function(km){
        expect(km).to.be.an.instanceof(kbpgp.KeyManager);
        done();
      });
    });

    it('should provide an asp', function() {
      var peer = new Peer();
      var spy = new sinon.spy(peer.asp, "_progress_hook");
      peer.generateKeys('test123');
      setTimeout(function() {
        expect(spy.called).to.be.true;
      }, 20);
    });

  });
});