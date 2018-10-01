const assert = require('assert')

describe('A test bloc that always pass', () => {
  it('a simple test', () => {
    assert.strictEqual(2, 2)
  })
  it('a simple async test', (done) => {
    done()
  })
  it('a simple async using promise', () => {
    return Promise.resolve()
  })
})
