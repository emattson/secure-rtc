var Peer = require('../src/index');
var SimplePeer = require('simple-peer');
var utils = require('./utils');
var kbpgpLocal = require('kbpgp');

describe('secure-rtc', function() {
  this.timeout(20000); //20 seconds callback timeout cause pgp can be slow

  function cleanup(peer) {
    peer.asp.canceler().cancel();
    peer.destroy();
  }

  describe('webrtc', function() {
    it('should inherit properties from simple-peer', function () {
      var peer = new Peer();
      expect(peer).to.be.an('object');
      expect(peer).to.be.an.instanceof(SimplePeer);
    });
  });

  describe('pgp key generation and exporting', function() {
    it('should generate an ecc PGP key pair', function(done) {
      var peer = new Peer();
      var ecc = sinon.spy(peer.kbpgp.KeyManager, 'generate_ecc');
      peer.generateKeys('new id');
      setTimeout(function() {
        expect(ecc.calledOnce).to.be.true;
        cleanup(peer);
        done();
      }, 100);
    });

    it('should generate a rsa PGP key pair', function(done) {
      var peer = new Peer({ecc: false});
      var rsa = sinon.spy(peer.kbpgp.KeyManager, 'generate_rsa');
      peer.generateKeys('new id');
      setTimeout(function() {
        expect(rsa.calledOnce).to.be.true;
        cleanup(peer);
        done();
      }, 100);
    });

    it('should be able to import keys', function(done) {
      var peer = new Peer();
      var imported = sinon.spy(peer.kbpgp.KeyManager, 'import_from_armored_pgp');
      peer.importKey(utils.publicKey);
      setTimeout(function() {
        expect(imported.calledOnce).to.be.true;
        cleanup(peer);
        done();
      }, 100)
    });

    it('should be able to export its public key', function(done) {
      var peer = new Peer();
      peer.generateKeys('id');
      setTimeout(function() {
        var keyGen = sinon.spy(peer.mykeys, 'export_public');
        peer.exportKey();
        expect(keyGen.calledOnce).to.be.true;
        cleanup(peer);
        done();
      }, 2000);
    });

    it('should provide an asp'); //TODO: works, but write a working test

    it('should export kbpgp', function() {
      var peer = new Peer();
      expect(peer).to.have.ownProperty('kbpgp');
    })
  });

  describe('')
});