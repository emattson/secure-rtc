var Peer = require('../src/index');
var SimplePeer = require('simple-peer');
var utils = require('./utils');

describe('secure-rtc', function() {
  this.timeout(20000); //20 seconds callback timeout cause pgp can be slow
  describe('webrtc', function() {
    it('should inherit properties from simple-peer', function () {
      var peer = new Peer();
      expect(peer).to.be.an('object');
      expect(peer).to.be.an.instanceof(SimplePeer);
    });
  });

  describe('pgp keys', function() {
    var peer;
    after(function() {
      //cleanup
      peer.asp.canceler.cancel();
      peer = null;
    });

    it('should generate an ecc PGP key pair', function(done) {
      peer = new Peer();
      var ecc = sinon.spy(peer.kbpgp.KeyManager, 'generate_ecc');
      peer.generateKeys('new id');
      setTimeout(function() {
        expect(ecc.calledOnce).to.be.true;
        done();
      }, 100);
    });

    it('should generate a rsa PGP key pair', function(done) {
      peer = new Peer({ecc: false});
      var rsa = sinon.spy(peer.kbpgp.KeyManager, 'generate_rsa');
      peer.generateKeys('new id');
      setTimeout(function() {
        expect(rsa.calledOnce).to.be.true;
        done();
      }, 100);
    });

    it('should be able to import keys', function(done) {
      peer = new Peer();
      var imported = sinon.spy(peer.kbpgp.KeyManager, 'import_from_armored_pgp');
      peer.importKey(utils.publicKey);
      setTimeout(function() {
        expect(imported.calledOnce).to.be.true;
        done();
      }, 100)
    });

    it('should be able to export its public key', function(done) {
      peer = new Peer();
      var keyGen = sinon.spy(peer.mykeys, 'export_public');
      peer.exportKey();
      setTimeout(function() {
        expect(keyGen.calledOnce).to.be.true;
        done();
      }, 100);
    });

    it('should provide an asp', function(done) {
      var progressSpy = sinon.spy();
      var peer2 = new Peer({ecc: true, asp: new kbpgp.ASP({progress_hook: progressSpy})});
      peer2.generateKeys('test123');
      //here
    });

  });
});