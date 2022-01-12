// Import Express
const express = require('express')

// Import Moment เพื่อไว้จัดรูปแบบวันที่
const moment = require('moment')

// Import ObjectID ของ MongoDb
const objectId = require('mongodb').ObjectId

const router = express.Router()

// Import mongodb_dbconfig
const { connectDb, getDb } = require('../config/mongdb_dbconfig')
var db
connectDb(() => (db = getDb()))

router.get('',(req, res)=>{
    res.render(
        'pages/backend/dashboard', 
        { 
            title: 'Dashboard', 
            heading: 'Dashboard',
            layout: './layouts/backend'
        }
    )
})

// CRUD Category ================================================
// Read Category
router.get('/category', async (req, res)=>{

    const category = await db.collection('category').find({}, { sort: { CategoryID: -1 } }).toArray()
    
        
    // res.json(category)

    res.render(
        'pages/backend/category', 
        { 
            title: 'Category', 
            heading: 'Category',
            layout: './layouts/backend',
            data: category,
            moment: moment
        }
    )
})

// Create Category
router.get('/create_category',(req, res)=>{
    res.render(
        'pages/backend/create_category', 
        { 
            title: 'Create Category', 
            heading: 'Create Category',
            layout: './layouts/backend'           
        }
    )
})

// Create Category POST
router.post('/create_category', async (req, res) => {
    
    // การอ่าน Category ID ล่าสุด
    const category = await db.collection('category').findOne({}, {sort: {CategoryID:-1}, limit: 1})
    const CategoryID = category.CategoryID + 1

    
    // ทดสอบ
    console.log(category.CategoryID)
    // return 0

    // รับค่าจากฟอร์ม
    // let CategoryID = req.body.CategoryID  // ไม่ต่องกรอกจากฟอร์ม
    let CategoryName = req.body.CategoryName
    let CategoryStatus = req.body.CategoryStatus
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let errors = false

    // console.log(CategoryID + CategoryName + CategoryStatus)

    // Validate ฟอร์มว่าป้อนข้อมูลครบหรือยัง
    if(CategoryID === '' || CategoryName.length === 0 || CategoryStatus === '')
    // if(CategoryName.length === 0 || CategoryStatus === '')
    {
        errors = true
        // แสดงข้อความแจ้งเตือน
        req.flash('error','ป้อนข้อมูลในฟิลด์ให้ครบก่อน')
        // ให้ทำการ reload ฟอร์ม
        res.render(
            'pages/backend/create_category', 
            { 
                title: 'Create Category', 
                heading: 'Create Category',
                layout: './layouts/backend'
            }
        )

    }else{
        // Insert to mongodb
        await db.collection('category').insertOne({
            // CategoryID: parseInt(CategoryID), // ของเดิมที่ไม่ยังไม่มีการ find
            CategoryID: CategoryID,
            CategoryName: CategoryName,
            CategoryStatus: parseInt(CategoryStatus),
            CreatedDate: curdatetime,
            ModifiedDate: curdatetime
        })

        // แสดงข้อความแจ้งเตือน
        req.flash('success','เพิ่มหมวดหมู่สินค้าเรียบร้อยแล้ว')

        res.render(
            'pages/backend/create_category', 
            { 
                title: 'Create Category', 
                heading: 'Create Category',
                layout: './layouts/backend'
            }
        )
    }
})

// Edit Category
router.get('/edit_category/:id', async (req, res) => {

    const objID = new objectId(req.params.id) 
    
    const category = await db.collection('category').find({ "_id": objID }).toArray()
    

    res.render(
        'pages/backend/edit_category', 
        { 
            title: 'Edit Category', 
            heading: 'Edit Category',
            layout: './layouts/backend',
            data: category
        }
    )
})


// Edit Category PUT บันทึกเข้าเมื่อแก้ไขแล้ว
router.put('/edit_category/:id/:resource', async (req, res) => {
    // console.log(req.params.id);

    const objID = new objectId(req.params.id)
    const category = await db.collection('category').find({ "_id": objID }).toArray()
    
// รับค่าจากฟอร์ม
    // let CategoryID = req.body.CategoryID  // ไม่ต่องกรอกจากฟอร์ม
    let CategoryName = req.body.CategoryName
    let CategoryStatus = req.body.CategoryStatus
    let curdatetime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let errors = false

    // console.log(CategoryID + CategoryName + CategoryStatus)

    // Validate ฟอร์มว่าป้อนข้อมูลครบหรือยัง
    if(CategoryName.length === 0 || CategoryStatus === '')
    {
        errors = true
        // แสดงข้อความแจ้งเตือน
        req.flash('error','ป้อนข้อมูลในฟิลด์ให้ครบก่อน')
        // ให้ทำการ reload ฟอร์ม
        res.render(
            'pages/backend/edit_category', 
            { 
                title: 'Create Category', 
                heading: 'Create Category',
                layout: './layouts/backend',
                data: category
            }
        )
    }else{
        // Insert to mongodb
        await db.collection('category').updateOne({ _id: objID },
            {
                $set: {
                    CategoryName: CategoryName,
                    CategoryStatus: parseInt(CategoryStatus),
                    ModifiedDate: curdatetime  
                }                
            }            
        )
        // แสดงข้อความแจ้งเตือน
        req.flash('success','แก้ไขหมวดหมู่สินค้าเรียบร้อยแล้ว')

        res.render(
            'pages/backend/edit_category', 
            { 
                title: 'Edit Category', 
                heading: 'Edit Category',
                layout: './layouts/backend',
                data: category
            }
        )
    }

    

})

// DELETE Category
    router.delete('/delete_category/:id/:resource', async (req, res) => {
        // console.log(req.params.id);
        const objID = new objectId(req.params.id)
        await db.collection('category').deleteOne({ "_id": objID })
        res.redirect('/backend/category')
    })


// CRUD product ================================================
// Read product

router.get('/products', async (req, res) => {
    // const products = await db.collection('products').find({}).toArray() // แบบอ่านทั้งหมดไม่ lookup
    const products = await db.collection('category').aggregate(
        [
            {
                $lookup: {
                    from: 'products',
                    localField: 'CategoryID',
                    foreignField: 'CategoryID',
                    as: 'products'
                }                
            },
            {
                "$match": {
                    "products" : {"$ne":[]}
                }
            }
        ]
    ).toArray()

    // console.log(products);
    // res.json(products)
    res.render(
        'pages/backend/products', 
        { 
            title: 'Products', 
            heading: 'Products',
            layout: './layouts/backend',
            data: products,
            moment: moment
        }
    )
})


// Create Product
router.get('/create_product',(req, res)=>{
    res.render(
        'pages/backend/create_product', 
        { 
            title: 'Create Product', 
            heading: 'Create Product',
            layout: './layouts/backend'
        }
    )
})

// การอัพเดท document


// Delete
// router.delete('/delete_category', (req, res) => {
//     let 
// })



// Edit Product
router.get('/edit_product', (req, res) => {
    let id = req.query.id
    let tag = req.query.tag
    res.send(id + tag)
    
    res.render(
        'pages/backend/edit_product', 
        { 
            title: 'Edit Products', 
            heading: 'Edit Products',
            layout: './layouts/backend'
        }
    )
})

module.exports = router