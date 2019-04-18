const nfsc = require('node-nfsc');

class NFSClient {
  constructor(options) {
    this.stash = new nfsc.V3(options);
  }

  mount() {
    return new Promise((resolve, reject) => {
      this.stash.mount((err, root) => {
        if (err) {
          reject(err);
        } else {
          this.root = root;
          resolve(root);
        }
      });
    });
  }

  unmount() {
    return new Promise((resolve, reject) => {
      this.stash.unmount((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  readdir(dir) {
    return new Promise((resolve, reject) => {
      this.stash.readdir(dir, {}, (err, dir_attributes, cookieverf, eof, entries) => {
        if (err) {
          reject(err);
        } else {
          this.stash.readdirplus(dir, {}, (err, dir_attributes, cookieverf, eof, plusEntries) => {
            plusEntries.reduce((acc, val) => {
              //console.log('acc', acc, acc.findIndex);
              const idx = acc.findIndex(n => n.fileid.compare(val.fileid));
              //console.log(idx, acc, val);
              acc[idx] = Object.assign(acc[idx], val);
              console.log('acc[idx]', acc[idx]);
              return acc;
            }, entries);

            if (err) {
              reject(err);
            } else {
              resolve(entries);
            }
          });
        }
      });
    });
  }

  create(dir, name, mode, arg) {
    return new Promise((resolve, reject) => {
      this.stash.create(dir, name, mode || 0, {}, (err, obj, obj_attrs, dir_wcc) => {
        if (err) {
          reject(err);
        } else {
          resolve(obj);
        }
      });
    });
  }

  write(file, offset, buf) {
    return new Promise((resolve, reject) => {
      this.stash.write(file, Buffer.byteLength(buf), offset, 2, buf, (err, commited, count, verf, attrs) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }

  writeFile(dir, name, buf) {
    return this.create(dir, name, 0, { })
    .then(file => {
      this.setattr(file, { mode: 0o100755 }).catch(console.log);
      return file;
    })
    .then(file => this.write(file, 0, buf));
  }

  mkdir(dir, name) {
    return new Promise((resolve, reject) => {
      this.stash.mkdir(dir, name, { mode: 0o100755}, (err, object, obj_attrs, dir_wcc) => {
        if (err) {
          reject(err);
        } else {
          resolve(object);
        }
      });
    });
  }

  setattr(file, attrs) {
    return new Promise((resolve, reject) => {
      this.stash.setattr(file, attrs, null, (err, wcc) => {
        if (err) {
          reject(err);
        } else {
          resolve(wcc);
        }
      });
    });
  }

  getattr(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject();
      } else {
        this.stash.getattr(file, (err, obj_attributes) => {
          if (err) {
            reject(err);
          } else {
            resolve(obj_attributes);
          }
        });
      }
    });
  }
}

module.exports = NFSClient;
