const { FraudRadar } = require('./FraudRadar')
const fraudRadar = new FraudRadar()
const assert = require('assert')

describe('Fraud Radar', function () {
  it('Should process the one line file', function () {
    let result = fraudRadar.Check('OneLineFile.txt')
    assert.ok(result)
    assert.equal(result.length, 0)
  })

  it('Should process the two line file in which the second is fraudulent', function () {
    let result = fraudRadar.Check('TwoLines_FraudulentSecond.txt')
    assert.ok(result)
    assert.equal(result.length, 1)
    assert.equal(result[0].orderId, 2)
  })

  it('Should process the three line file in which the second is fraudulent', function () {
    let result = fraudRadar.Check('ThreeLines_FraudulentSecond.txt')
    assert.ok(result)
    assert.equal(result.length, 1)
    assert.equal(result[0].orderId, 2)
  })

  it('Should process the four line file in which more than one order is fraudulent', function () {
    let result = fraudRadar.Check('FourLines_MoreThanOneFraudulent.txt')
    assert.ok(result)
    assert.equal(result.length, 2)
  })
})
