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

const findAverageAge = (arr) => {
   const { length } = arr;
   return arr.reduce((acc, val) => {
      return acc + (val.value/length);
   }, 0);
};

const getFertilizersAndCrop = async(arr , type) => {
    if(type === 'fertilizers'){
          const browser = await puppeteer.launch({ headless: false, devtools: true })
        const page = await browser.newPage()
        await page.goto('https://harvestify.herokuapp.com/fertilizer')

        await page.click('#Nitrogen')
        await page.keyboard.type('20')

        await page.click('#Phosphorous')
        await page.keyboard.type('20')

        await page.click('#Pottasium')
        await page.keyboard.type('20')

        await page.select('select#crop', 'rice')

        await page.click('.btn-info')
        const html = await page.content()
    }else{
        const browser = await puppeteer.launch({ headless: false, devtools: true })
        const page = await browser.newPage()
        await page.goto('https://harvestify.herokuapp.com/crop-recommend')

        await page.click('#Nitrogen')
        await page.keyboard.type('20')

        await page.click('#Phosphorous')
        await page.keyboard.type('20')

        await page.click('#Pottasium')
        await page.keyboard.type('20')

        await page.click('#ph')
        await page.keyboard.type('20')

        await page.click('#Rainfall')
        await page.keyboard.type('20')

        await page.select('select#sts', 'Rajasthan')

        await page.select('select#state', 'Udaipur')

        await page.click('.btn-info')
        const html = await page.content()
    }

}


router.get('/', async(req, res) => {
    
    const data = await SensorData.find().sort({ date_time: 'asc' })
    const phdata = data.filter(a => a.sensor === 'ph')
const tempdata = data.filter(a => a.sensor === 'temperature')
    res.render('admin', {phvalue: findAverageAge(phdata), tempValue: findAverageAge(tempdata)+20 })
})

router.get('/generate', async(req, res) => {
    var i,
  j,
  temporary,
  count = 0,
  chunk = 20
for (i = 0, j = 140; i < j; i += chunk) {
    count++
  temporary = data.slice(i, i + chunk)
  console.log(temporary)
  try {
    console.log('started')
    console.log(await SensorData.insertMany(temporary.map((doc) => ({
      sensor: 'temperature', 
      value: doc.sensor_value,
      date_time:(`2021-09-0${count+1}`)
  }))))
  } catch (error) {
      console.log(error)
  }
  

}

for(i=0; i<100; i++){
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