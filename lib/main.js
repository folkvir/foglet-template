const FC = require('foglet-core')
const Foglet = FC.Foglet
const lmerge = require('lodash.merge')
const Overlay = require('./overlay/overlay.js')
const debug = (require('debug'))('template')
const EventEmitter = require('events')

class Template extends EventEmitter {
  constructor (options, moc = false) {
    super()
    this.options = lmerge({
      foglet: {
        verbose: true, // want some logs ? switch to false otherwise
        rps: {
          type: 'cyclon',
          options: {
            protocol: 'foglet-template', // foglet running on the protocol foglet-example, defined for spray-wrtc
            webrtc: { // add WebRTC options
              trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
              config: { iceServers: [] } // define iceServers in non local instance
            },
            timeout: 1 * 1000, // spray-wrtc timeout before definitively close a WebRTC connection.
            pendingTimeout: 10 * 1000, // time before the connection timeout in neighborhood-wrtc
            delta: 2 * 1000, // spray-wrtc shuffle interval
            maxPeers: 5,
            a: 1, // for spray: a*ln(N) + b, inject a arcs
            b: 0, // for spray: a*ln(N) + b, inject b arcs
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
              delta: 2 * 1000,
              timeout: 2 * 1000,
              pendingTimeout: 10 * 1000,
              maxPeers: 1,
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
    // if moc === true we use a WebRTC moc for the rps, still webrtc connection for the overlay, dont use the same moc!!
    if (moc) {
      this.options.foglet.rps.options.socketClass = require('foglet-core').SimplePeerMoc
    }
    this.foglet = new Foglet(this.options.foglet)
    this.foglet.onUnicast((id, message) => {
      debug('[%s] Receiving on the RPS from %s message:', this.foglet.inViewID, id, message)
      this.emit('receive-rps', id, message)
    })
    this.foglet.overlay('tman').communication.onUnicast((id, message) => {
      debug('[%s] Receiving on the overlay from %s message:', this.foglet.inViewID, id, message)
      this.emit('receive-overlay', id, message)
    })
    this.foglet.overlay().network.rps.on('open', (id) => {
      debug('[%s] connection opened on the rps: ', this.foglet.inViewID, id)
      this.emit('rps-open', id)
    })
    this.foglet.overlay('tman').network.rps.on('open', (id) => {
      debug('[%s] connection opened on the overlay: ', this.foglet.inViewID, id)
      this.emit('overlay-open', id)
    })
    this.foglet.overlay().network.rps.on('close', (id) => {
      debug('[%s] connection closed on the rps: ', this.foglet.inViewID, id)
      this.emit('rps-close', id)
    })
    this.foglet.overlay('tman').network.rps.on('close', (id) => {
      debug('[%s] connection closed on the overlay: ', this.foglet.inViewID, id)
      this.emit('overlay-close', id)
    })
    debug('Template initialized.')
  }

  connection (template) {
    if (template) return this.foglet.connection(template.foglet, 'tman')
    this.foglet.share()
    return this.foglet.connection(undefined, 'tman')
  }

  sendUnicast (id, message) {
    return this.foglet.sendUnicast(id, message)
  }

  sendUnicastAll (message) {
    this.neighbours().forEach(peer => {
      this.sendUnicast(peer, message)
    })
  }

  sendOverlayUnicast (id, message) {
    return this.foglet.overlay('tman').communication.sendUnicast(id, message)
  }

  sendOverlayUnicastAll (message) {
    this.neighboursOverlay().forEach(peer => {
      this.send(peer, message)
    })
  }

  neighbours () {
    return this.foglet.getNeighbours()
  }

  neighboursOverlay () {
    return this.foglet.overlay('tman').network.getNeighbours()
  }

  changeLocation(x,y){
    this.foglet.overlay('tman').network.descriptor.x = x
    this.foglet.overlay('tman').network.descriptor.y = y
    console.log(this.foglet.overlay().network.getNeighbours())
    let parent = this.foglet.overlay().network.getNeighbours()
    let child = this.foglet.overlay('tman').network.getNeighbours()

    let diff = parent.filter(value => -1 === child.indexOf(value));

    /*diff.forEach((peer)=>{
      this.connection(peer)
    })*/

    console.log('diff', diff)

    this.foglet.overlay('tman').signaling

    this.emit('changelocation', this.foglet)
  }
}

module.exports = Template
