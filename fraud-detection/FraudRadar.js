const fs = require('fs')
const path = require('path')

class FraudRadar {
  constructor (fileDir = './Files') {
    this.fileDir = fileDir
    this.path = path.resolve(fileDir)
  }

  readFile (fileName) {
    let fileContent = fs.readFileSync(
      path.resolve(this.path, `${fileName}`),
      'utf8'
    )
    let lines = fileContent.split('\n')
    return lines.map(l => {
      const items = l.split(',')
      if (items.length !== 8) {
        throw new Error(`Invalid line format. Value: ${l}`)
      }
      return {
        orderId: Number(items[0]),
        dealId: Number(items[1]),
        email: items[2].toLowerCase(),
        street: items[3].toLowerCase(),
        city: items[4].toLowerCase(),
        state: items[5].toLowerCase(),
        zipCode: items[6],
        creditCard: items[7]
      }
    })
  }

  normalizeEmail (email) {
    let aux = email.split('@')
    let atIndex = aux[0].indexOf('+')
    aux[0] =
      atIndex < 0
        ? aux[0].replace('.', '')
        : aux[0].replace('.', '').substring(0, atIndex - 1)
    return aux.join('@')
  }

  normalizeStreet (street) {
    return street.replace('st.', 'street').replace('rd.', 'road')
  }

  normalizeState (street) {
    return street
      .replace('il', 'illinois')
      .replace('ca', 'california')
      .replace('ny', 'new york')
  }

  normalizeOrders (orders) {
    return orders.map(order => {
      order.email = this.normalizeEmail(order.email)
      order.street = this.normalizeStreet(order.street)
      order.state = this.normalizeState(order.street)
    })
  }

  isEmailFraud (order, fraudCandidate) {
    return (
      order.dealId === fraudCandidate.dealId &&
      order.email === fraudCandidate.email &&
      order.creditCard !== fraudCandidate.creditCard
    )
  }

  isAddressFraud (order, fraudCandidate) {
    return (
      order.dealId === fraudCandidate.dealId &&
      order.state === fraudCandidate.state &&
      order.zipCode === fraudCandidate.zipCode &&
      order.street === fraudCandidate.street &&
      order.city === fraudCandidate.city &&
      order.creditCard !== fraudCandidate.creditCard
    )
  }

  Check (filePath) {
    const orders = this.readFile(filePath)
    this.normalizeOrders(orders)
    const frauds = []
    let order = orders.shift()
    while (orders.length > 0) {
      const fraudulentOrder = orders.find(
        fraudCandidate =>
          this.isEmailFraud(order, fraudCandidate) ||
          this.isAddressFraud(order, fraudCandidate)
      )
      if (fraudulentOrder) frauds.push(fraudulentOrder)
      order = orders.shift()
    }
    return frauds
  }
}

module.exports = { FraudRadar }
