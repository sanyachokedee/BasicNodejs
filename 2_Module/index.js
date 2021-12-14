// import แบบที่ 1
const utils = require('./utils')


// เรียกใช้งาน utils ได้แล้ว
utils.sayHello()
const vat = utils.calculateVat(90, 7)
console.log(vat);


// แบบที่ 2 การใช้ destructuring
const  { calculateVat , sayHello  } = require('./utils.js')
sayHello()
const vat2 = calculateVat(300, 7)
console.log(vat2);