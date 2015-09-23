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

  this.emitter = this.emit;
  this.emit = function (type) {
    var args = [].slice.call(arguments, 1);
    //console.log(arguments);
    switch (type) {
      case 'signal':
        args[0].publicKey = 'pubKey';// this.exportKey();
        return this.emitter('signal', args[0]);
      default:
          switch(args.length){
            case 0:
              return this.emitter(type);
            case 1:
              return this.emitter(type, args[0]);
            case 2:
              return this.emitter(type, args[0], args[1]);
            case 3:
              return this.emitter(type, args[0], args[1], args[2]);
            default:
              throw new Error('too many emitter args');
          }
    }
  };
  //debugger;

}
inherits(Peer, SimplePeer);

Peer.WEBRTC_SUPPORT = SimplePeer.WEBRTC_SUPPORT;

Peer.prototype._keygen = function (err, km) {
  if (err != null) {
    console.log('Problem generating keys: ', err);
  } else {
    km.sign({}, function (err) {
      if (!err) {
        this.ring.add_key_manager(km);
        this.mykeys = km;
        //this.exportKey(km);
      }
    }.bind(this));
  }
};

Peer.prototype._keyimport = function (err, km) {
  if (err) {
    console.log('Problem importing:', err);
  } else {
    this.ring.add_key_manager(km);
  }
};

Peer.prototype._keyexport = function (err, key) {
  if (err) {
    console.log('Problem exporting:', err);
  } else {
    this.publicKey = key;
  }
};

Peer.prototype.generateKeys = function (id, cb) {
  var params = {
    asp: this.asp,
    userid: id
  };
  cb = cb !== undefined ? cb : this._keygen;
  if (this.ecc) {
    kbpgp.KeyManager.generate_ecc(params, cb.bind(this));
  } else {
    kbpgp.KeyManager.generate_rsa(params, cb.bind(this));
  }
};

Peer.prototype.importKey = function (key, cb) {
  cb = cb !== undefined ? cb : this._keyimport;
  kbpgp.KeyManager.import_from_armored_pgp({armored: key, asp: this.asp}, cb.bind(this));
};

Peer.prototype.exportKey = function (cb) {
  cb = cb !== undefined ? cb : this._keyexport;
  if (this.publicKey) {
    return this.publicKey;
  } else {
    this.mykeys.export_public({}, cb.bind(this));
  }
};


module.exports = Peer;

