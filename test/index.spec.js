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

    //it('should be able to import keys', function(done) {
    //  var peer = new Peer();
    //  debugger;
    //  peer.importKey(utils.publicKey, function(km){
    //    debugger;
    //    expect(km).to.be.an.instanceof(kbpgp.KeyManager);
    //    done();
    //  });
    //});
    //
    //it('should be able to export its public key', function(done) {
    //  var peer = new Peer();
    //  peer.exportKey(function(key) {
    //    expect(key).to.match(/-----BEGIN PGP PUBLIC KEY BLOCK-----.+/);
    //    done();
    //  });
    //});

    //it('should provide an asp', function(done) {
    //  var peer2 = new Peer({ecc: true, asp: new kbpgp.ASP({progress_hook: new sinon.spy()})});
    //  peer2.generateKeys('test123', function() {
    //    done();
    //  });
    //});

  });
});