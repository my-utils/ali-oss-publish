const OSS = require('ali-oss')
const fs = require('fs')

class PublishOSS extends OSS {
  constructor(...props) {
    super(...props)
  }
  async putOSS(src, dist) {
    try {
      await this.put(dist, src);
      console.log('upload success:', dist);
    } catch (e) {
      console.log('err', e);
    }
  }

  async addFileToOSSSync(src, dist) {
    var docs = fs.readdirSync(src);
    for (const doc of docs) {
      var _src = src + '/' + doc
      var _dist = dist + '/' + doc
      var st = fs.statSync(_src)
      if (st.isFile() && doc !== '.DS_Store') {
        await this.putOSS(_src, _dist)
      } else if (st.isDirectory()) {
        this.addFileToOSSSync(_src, _dist)
      }
    }
  }

  async publish(src, dist) {
    try {
      await this.addFileToOSSSync(src, dist)
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
}

module.exports = PublishOSS
