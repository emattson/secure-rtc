var SimplePeer = require('simple-peer');
var inherits = require('inherits');
var kbpgp = require('kbpgp');

function Peer(options) {
  options = options === undefined ? {} : options;
  //constructor based on simple-peer
  SimplePeer.call(this, options);
  this.ecc = options.ecc !== undefined ? options.ecc : true;

  this.id = options.id !== undefined ? options.id : (Math.random() * 99999999).toString(16);
  //keyring
  this.ring = new kbpgp.keyring.KeyRing();
  //use ecc
  this.mykeys;

  this.asp = options.asp !== undefined ? options.asp : new kbpgp.ASP({
    progress_hook: function (o) {
      console.log(o);
    }
  });

  //hack a way to pass back so I can spy on it
  this.kbpgp = kbpgp;

  var emitter = this.emit;

  function intercept(event) {
    var args = [].slice.call(arguments, 1);
    switch (event) {
      case 'signal':
        args[0].foo = 'bar';
        emitter('signal', args);
        break;
      default:
        emitter(event, args);
    }
  }
  this.emit = intercept;

}
inherits(Peer, SimplePeer);

Peer.WEBRTC_SUPPORT = SimplePeer.WEBRTC_SUPPORT;

Peer.prototype.generateKeys = function (id) {
  var params = {
    asp: this.asp,
    userid: id
  };
  if (this.ecc) {
    kbpgp.KeyManager.generate_ecc(params, function (err, km) {
      if (err != null) {
        console.log('Problem generating ecc: ', err);
      } else {
        km.sign({}, function (err) {
          if (!err) {
            this.ring.add_key_manager(km);
            this.mykeys = km;

          }
        }.bind(this));
      }
    }.bind(this));
  } else {
    kbpgp.KeyManager.generate_rsa(params, function (err, km) {
      if (err != null) {
        console.log('Problem generating rsa: ', err);
      } else {
        km.sign({}, function (err) {
          if (err != null) {
            this.ring.add_key_manager(km);
            this.mykeys = km;
          }
        }.bind(this));
      }
    }.bind(this));
  }
};

Peer.prototype.importKey = function (key) {
  kbpgp.KeyManager.import_from_armored_pgp({armored: key, asp: this.asp}, function (err, km) {
    if (err) {
      console.log('Problem importing:', err);
    } else {
      this.ring.add_key_manager(km);
    }
  }.bind(this));
};

Peer.prototype.exportKey = function () {
  if (this.publicKey) {
    return this.publicKey;
  } else {
    this.mykeys.export_public({}, function (err, key) {
      if (err) {
        console.log('Problem exporting:', err);
      } else {
        this.publicKey = key;
      }
    }.bind(this));
  }
};


module.exports = Peer;

