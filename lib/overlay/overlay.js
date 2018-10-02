const TMAN = require('./abstract')
const debug = (require('debug'))('template:overlay')

module.exports = class Overlay extends TMAN {
  constructor (...Args) {
    super(...Args)
    debug('Overlay initialized')
    this.rps._partialViewSize = () => this.options.maxPeers
  }

  /**
   * Gives the start descriptor used by the TMan overlay (can be an empty object).
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @return {Object} The start descriptor used by the TMan overlay
   */
  _startDescriptor () {
    return {
      val: 'test'
    }
  }

  /**
   * Give the delay **in milliseconds** after which the descriptor must be recomputed.
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @return {number} The delay **in milliseconds** after which the descriptor must be recomputed
   */
  _descriptorTimeout () {
    return 30 * 1000
  }

  /**
   * Compare two peers and rank them according to a ranking function.
   * This function must return `0 if peerA == peerB`, `1 if peerA < peerB` and `-1 if peerA > peerB`.
   *
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @param {*} neighbour - The neighbour to rank with
   * @param {Object} descriptorA - Descriptor of the first peer
   * @param {Object} descriptorB - Descriptor of the second peer
   * @param {TManOverlay} peerA - (optional) The overlay of the first peer
   * @param {TManOverlay} peerB - (optional) The overlay of the second peer
   * @return {integer} `0 if peerA == peerB`, `1 if peerA < peerB` and `-1 if peerA > peerB` (according to the ranking algorithm)
   */
  _rankPeers (neighbour, descriptorA, descriptorB, peerA, peerB) {
    // console.log(neighbour, descriptorA, descriptorB, peerA, peerB)
    return 1
  }
}
