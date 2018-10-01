const FC = require('foglet-core')
const Foglet = FC.Foglet
const lmerge = require('lodash.merge')
const Overlay = require('./overlay')
const Network = require('foglet-core/src/network/network.js')
console.log(Network)
const debug = (require('debug'))('template')

class Template {
  constructor (options) {
    this.options = lmerge({
      foglet: {
        verbose: true, // want some logs ? switch to false otherwise
        rps: {
          type: 'spray-wrtc',
          options: {
            protocol: 'foglet-template', // foglet running on the protocol foglet-example, defined for spray-wrtc
            webrtc: { // add WebRTC options
              trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
              config: { iceServers: [] } // define iceServers in non local instance
            },
            timeout: 60 * 1000, // spray-wrtc timeout before definitively close a WebRTC connection.
            pendingTimeout: 60 * 1000, // time before the connection timeout in neighborhood-wrtc
            delta: 60 * 1000, // spray-wrtc shuffle interval
            maxPeers: 5,
            a: 1, // for spray: a*ln(N) + b, inject a arcs
            b: 5, // for spray: a*ln(N) + b, inject b arcs
            signaling: {
              address: 'https://signaling.herokuapp.com/',
              // signalingAdress: 'https://signaling.herokuapp.com/', // address of the signaling server
              room: 'room-foglet-template' // room to join
            }
          }
        },
        overlays: [
          {
            name: 'tman',
            class: Overlay,
            options: {
              delta: 10 * 1000,
              protocol: 'foglet-template-overlay', // foglet running on the protocol foglet-example, defined for spray-wrtc
              signaling: {
                address: 'https://signaling.herokuapp.com/',
                // signalingAdress: 'https://signaling.herokuapp.com/', // address of the signaling server
                room: 'room-foglet-template-overlay' // room to join
              }
            }
          }
        ],
        ssh: undefined /* {
          address: 'http://localhost:4000/'
        } */
      }
    }, options)

    this.foglet = new Foglet(this.options.foglet)
    debug('Template initialized.')
  }

  connection (template) {
    if (template) return this.foglet.connection(template.foglet)
    this.foglet.share()
    return this.foglet.connection()
  }
}

module.exports = Template
