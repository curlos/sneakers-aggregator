const express = require('express')
const mongoose = require('mongoose')
const sneakerSchema = require('../schemas/sneakerV2Schema')
const User = require('../models/User')

const router = express.Router()

const ALL_BRANDS = [
  "AIR JORDAN",
  "ADIDAS",
  "ALEXANDER MCQUEEN",
  "ASICS",
  "BALENCIAGA",
  "BURBERRY",
  "CHANEL",
  "COMMON PROJECTS",
  "CONVERSE",
  "CROCS",
  "DIADORA",
  "DIOR",
  "GUCCI",
  "JORDAN",
  "LI-NING",
  "LOUIS VUITTON",
  "NEW BALANCE",
  "NIKE",
  "OFF-WHITE",
  "PRADA",
  "PUMA",
  "REEBOK",
  "SAINT LAURENT",
  "SAUCONY",
  "UNDER ARMOUR",
  "VANS",
  "VERSACE",
  "YEEZY",
]

const ALL_GENDERS = [
  "CHILD",
  "INFANT",
  "MEN",
  "PRESCHOOL",
  "TODDLER",
  "UNISEX",
  "WOMEN",
  "YOUTH",
]

router.get('/all/brands', async (req, res) => {
  const allSneakers = []

  for (let brand of ALL_BRANDS) {
    try {
      const Sneaker = mongoose.model('Sneaker', sneakerSchema, brand)
      console.log(`Getting all '${brand}' brand sneakers from database...`)
      const brandSneakers = await Sneaker.find({})
      allSneakers.push(brandSneakers)
    } catch (err) {
      console.error(err)
    }
  }

  console.log('All sneakers have been retrieved!')
  
  res.json(allSneakers)
})

router.get('/all/genders', async (req, res) => {
  const allSneakers = []

  for (let gender of ALL_GENDERS) {
    try {
      const Sneaker = mongoose.model('Sneaker', sneakerSchema, gender)
      console.log(`Getting all '${gender}' sneakers from database...`)
      const brandSneakers = await Sneaker.find({})
      allSneakers.push(brandSneakers)
    } catch (err) {
      console.error(err)
    }
  }

  console.log('All sneakers have been retrieved!')
  
  res.json(allSneakers)
})

router.get('/shoe/:brand/:sneakerID', async (req, res) => {
  const brand = req.params.brand.toUpperCase()
  const sneakerID = req.params.sneakerID

  console.log([brand, sneakerID])
  console.log(`Getting all '${brand}' brand sneakers from database...`)
  const Sneaker = mongoose.model('Sneaker', sneakerSchema, brand)
  

  const shoe = await Sneaker.find({ sneakerID: sneakerID })
  res.json(shoe)
})

router.put('/shoe/:brand/:sneakerID/like', async (req, res) => {
  const brand = req.params.brand.toUpperCase()
  const sneakerID = req.params.sneakerID

  const user = await User.findOne({_id: req.body.userID})

  const Sneaker = mongoose.model('Sneaker', sneakerSchema, brand)
  const shoe = await Sneaker.findOne({ sneakerID: sneakerID })

  if (req.body.action === 'increment') {
    console.log('increment nibba')
    shoe.favorites = shoe.favorites + 1 || 1
    user.shoeFavorites = user.shoeFavorites && [...user.shoeFavorites, shoe._id] || [shoe._id]

    console.log(user)
  } else {
    console.log('decrement bois')
    if (shoe.favorites && shoe.favorites <= 0) {
      shoe.favorites = 0
    } else {
      shoe.favorites = shoe.favorites - 1 || 0
    }
    user.shoeFavorites = [...user.shoeFavorites.filter((shoeID) => {
      console.log(shoeID)
      console.log(shoe._id.toString())
      console.log('-------------')
      return (
        shoeID !== shoe._id.toString()
      )
    })] || []
  }

  console.log(user)
  console.log(user.shoeFavorites.filter((shoeID) => shoeID !== shoe._id))
  
  await shoe.save()
  await user.save()
  res.json(
    {
      user: user,
      shoe: shoe
    }
  )
})



router.get('/brands/:brand', async (req, res) => {
  const brand = req.params.brand.toUpperCase()
  console.log(`Getting all '${brand}' brand sneakers from database...`)
  const Sneaker = mongoose.model('Sneaker', sneakerSchema, brand)

  const brandSneakers = await Sneaker.find({})
  res.json(brandSneakers)
})

router.get('/gender/:gender', async (req, res) => {
  const gender = req.params.gender.toUpperCase()
  console.log(`Getting all '${gender}' sneakers from database...`)
  const Sneaker = mongoose.model('Sneaker', sneakerSchema, gender)

  const genderSneakers = await Sneaker.find({})
  res.json(genderSneakers)
})

router.post('/all/filter', async (req, res) => {
  console.log(req.body)
  const filters = req.body

  const brand = req.params.brand.toUpperCase()
  console.log(`Getting all '${brand}' brand sneakers from database...`)
  const Sneaker = mongoose.model('Sneaker', sneakerSchema, brand)

  const brandSneakers = await Sneaker.find(filters)
  console.log(brandSneakers.length)
  res.json(brandSneakers)
})


router.post('/brands/:brand/filter', async (req, res) => {
  console.log(req.body)
  let filters = req.body

  if (Object.keys(filters).includes('name')) {
    const regex = new RegExp(filters.name)
    filters = {...filters, name: { $regex: regex, $options: 'i'}}
  }

  const brand = req.params.brand.toUpperCase()
  console.log(`Getting all '${brand}' brand sneakers from database...`)
  const Sneaker = mongoose.model('Sneaker', sneakerSchema, brand)

  const brandSneakers = await Sneaker.find(filters)
  console.log(brandSneakers.length)
  res.json(brandSneakers)
})



module.exports = router;