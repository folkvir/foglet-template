const assert = require('assert')
const Template = require('../lib').default

describe('Template', function () {
  this.timeout(20000)
  it('connection', function () {
    let f1 = new Template({
      foglet: {
        rps: {
          options: {
            webrtc: {
              wrtc: require('wrtc')
            }
          }
        }
      }
    })
    let f2 = new Template({
      foglet: {
        rps: {
          options: {
            webrtc: {
              wrtc: require('wrtc')
            }
          }
        }
      }
    })
    return f1.connection(f2)
  })

  it('send message on rps', async () => {
    let f1 = new Template({
      foglet: {
        rps: {
          options: {
            webrtc: {
              wrtc: require('wrtc')
            }
          }
        }
      }
    })
    let f2 = new Template({
      foglet: {
        rps: {
          options: {
            webrtc: {
              wrtc: require('wrtc')
            }
          }
        }
      }
    })
    await f1.connection(f2)
    return new Promise((resolve, reject) => {
      f2.on('receive-rps', (id, message) => {
        assert.strictEqual(message, 'miaou')
        resolve()
      })
      f1.sendUnicast(f2.foglet.outViewID, 'miaou')
    })
  })
  it('send message on rps', async () => {
    let f1 = new Template({
      foglet: {
        rps: {
          options: {
            webrtc: {
              wrtc: require('wrtc')
            }
          }
        }
      }
    })
    let f2 = new Template({
      foglet: {
        rps: {
          options: {
            webrtc: {
              wrtc: require('wrtc')
            }
          }
        }
      }
    })
    await f1.connection(f2)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        f2.on('receive-overlay', (id, message) => {
          assert.strictEqual(message, 'miaou')
          resolve()
        })
        console.log(f1.foglet.getNeighbours(), f2.foglet.inViewID)
        f1.sendOverlayUnicast(f2.foglet.inViewID, 'miaou')
      }, 2000)
    })
  })
})
