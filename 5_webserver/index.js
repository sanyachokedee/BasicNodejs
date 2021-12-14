// import HTTP Module สำหรับไว้สรา้ง WebServer
const http = require('http')

// อ่านไฟล์ path
const path = require('path')

// Import File System Module
const fs = require('fs')

// อ่านไไฟล์ html
const getPage = (page) => {
    const filePath = path.join(__dirname, page)
    return fs.readFileSync(filePath)
}


// Create Server
http.createServer((req, res) => {
    // res.write('<h1>Hello Node JS</h1>')
    // res.write('<p>This is my content</p>')
    // ตรวจสอบชนิดไฟล์ file type
    const fileType = path.extname(req.url) || '.html'

    if (fileType === '.html') {
        res.setHeader('Content-type', 'text/html')
        
        if (req.url === '/') {
            res.write(getPage('index.html'))
        }else if (req.url === '/about'){
            res.write(getPage('about.html'))
        }
        res.end()
    } else if (fileType === '.css') {
        res.setHeader('Content-type', 'text/css')
        res.write(getPage('style.css'))
        res.end()
    }
    
    
  

   
 
}).listen(3000)