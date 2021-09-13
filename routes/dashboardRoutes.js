if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const { triggerAsyncId } = require('async_hooks')
const express = require('express')
const path = require('path')
const {SensorData} = require('../models')
const router = express.Router()
const data = require('./data.json')
function getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}


router.get('/', async(req, res) => {
    

    res.render('admin', { price: "something" })
})

router.get('/generate', async(req, res) => {
//     var i,
//   j,
//   temporary,
//   count = 0,
//   chunk = 2000
// for (i = 0, j = data.length; i < j; i += chunk) {
//     count++
//   temporary = data.slice(i, i + chunk)
//   console.log(temporary)
//   try {
// //     console.log('started')
// //     console.log(await SensorData.insertMany(temporary.map((doc) => ({
// //       sensor: 'temperature', 
// //       value: doc.sensor_value,
// //       date_time:(`2021-09-0${count+1}`)
// //   }))))
//   } catch (error) {
//       console.log(error)
//   }
  

// }

for(i=0; i<1000; i++){
    console.log(await SensorData.create({
        sensor: 'ph',
        value: getRandomNumberBetween(2.5, 5.5),
        date_time: `2021-09-0${Math.floor(Math.random() * 6) + 1}`
    }))
    
}
})

router.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'))
})


module.exports = router