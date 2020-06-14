const { attachedAccessories } = require('../controllers/accessories')
const express = require('express');
const { checkAuthentication, getUserStatus, checkAuthenticationJSON } = require("../controllers/user");
const { updateCube } = require('../controllers/cubes');
const router = express.Router();

router.get('/create/accessory', checkAuthentication, getUserStatus, (req, res) => {
    res.render('createAccessory', {
        title: "Create Accessory | Cube Workshop",
        isLoggedIn: req.isLoggedIn
    })
})

router.post('/create/accessory', checkAuthenticationJSON, async (req, res) => {
    const {
        name,
        description,
        imageUrl
    } = req.body

    const accessory = new Accessory({
        name,
        description,
        imageUrl
    })

    await accessory.save()

    res.redirect('/')
})

router.get('/attach/accessory/:id', checkAuthentication, getUserStatus, async (req, res, next) => {
    const {
        id: cubeId
    } = req.params
    try {
        const data = await attachedAccessories(cubeId)
        console.log(data)
        res.render('attachAccessory', {
            title: 'Attach accessory',
            ...data,
            isLoggedIn: req.isLoggedIn
        });
    } catch (err) {
        next(err)
    }
})

router.post('/attach/accessory/:id', checkAuthenticationJSON, async (req, res, next) => {
    const {
        accessory: accessoryId
    } = req.body
    const {
        id: cubeId
    } = req.params
    try {
        await updateCube(cubeId, accessoryId)
        res.redirect(`/details/${cubeId}`)
    } catch (err) {
        next(err)
    }
})

module.exports = router