var SimplePeer = require('simple-peer');
var inherits = require('inherits');
var kbpgp = require('kbpgp');

function Peer(options) {
  options = options == undefined ? {} : options;
  //constructor based on simple-peer
  SimplePeer.call(this, options);
  this.id = options.id !== undefined ? options.id : (Math.random() * 99999999).toString(16);
  //keyring
  this.ring = new kbpgp.keyring.KeyRing();
  //use ecc
  this.ecc = options.ecc !== undefined ? options.ecc : false;
}

inherits(Peer, SimplePeer);

Peer.prototype._generateKeys = function (callback) {
  var params = {
    //asp: my_asp,
    userid: this.id
  };
  kbpgp.KeyManager.generate_ecc(params, function (err, peer) {
    if (err != null) {
      console.log('Problem: ', err);
    } else {
      // sign peer's subkeys
      peer.sign({}, function (err) {
        if (!err) {
          //me = peer;
          this.ring.add_key_manager(peer);
          this._hasKeys = true;
        }
      }.bind(this));
    }
  }.bind(this));
};
module.exports = Peer;

