const assert = require('assert')
const Template = require('../lib').default

describe('Connection', () => {
  it('connection', () => {
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
})
