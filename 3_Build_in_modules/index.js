// Node.js Built-in Modules
// ------------------------
// 1. File System (fs)
// 2. Path (path)
// 3. Operating System (os)
// 4. Events (events)
// 5. HTTP (http)
// ------------------------

//ดูข้อมูลไฟล์ ที่อยู่ ชนิดไฟล์
const path = require('path')
// console.log(path.basename(__filename))
// console.log(path.dirname(__filename))
// console.log(path.extname(__filename))
// console.log(path.parse(__filename))
// console.log(path.parse(__filename).base)

// File System (FS)
const fs = require('fs')

// สร้างไฟล์ใหม่ด้วย module fs 
// คำสั่ง path.join คือ ให้หาค่าที่อยู่ปัจจุบัน มาใส่ชื่อไฟล์ สร้างไฟล์ด้วยคำสั่ง fs.WriteFileSync
// fs.writeFileSync(path.join(__dirname,'data.txt'),'Hello Node JS')

// อ่านไฟล์
// ถ้าไฟล์ใหญ่ต้องใช้ readFile จะเป็นแบบ Async 
// ถ้าภาษาไทยต้องมี encode utf8
// console.log(fs.readFileSync(path.join(__dirname,'data.txt'),'utf8'))

// Operating System (os)
const os = require('os')

console.log(os.cpus())
console.log(os.hostname())
console.log(os.homedir())
console.log(os.uptime())
console.log(os.platform())
console.log(os.release())
console.log(os.arch())
console.log(os.type())
console.log(os.loadavg())
console.log(os.networkInterfaces())

// อ่าน ip เครื่อง 
console.log(os.networkInterfaces()['Wi-Fi'][1].family)
console.log(os.networkInterfaces()['Wi-Fi'][1].address)

console.log('เปิดเครื่อง =',1950202/60/60)