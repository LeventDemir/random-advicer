const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')


router.post('/sign-up', (req, res) => {
    const data = req.body

    const _id = mongoose.Types.ObjectId()

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    data._id = _id
    data.password = hash
    data.token = jwt.sign({ author: _id }, 'SeCrEtKeY');
    data.login = true

    new User(data).save(err => {
        if (!err) res.json({ token: data.token })

        else if (err.code == 11000) res.json({ exist: true })

        else res.json({ success: false })
    })
})


router.post('/sign-in', (req, res) => {
    const data = req.body

    User.findOne({ username: data.username }, (err, user) => {
        if (user) {
            if (bcrypt.compareSync(data.password, user.password)) {
                if (user.login) res.json({ token: user.token })

                else {
                    user.token = jwt.sign({ author: user._id }, 'SeCrEtKeY');
                    user.login = true

                    user.save(err => {
                        if (!err) res.json({ token: user.token })

                        else res.json({ success: false })
                    })
                }
            } else res.json({ success: false })
        } else res.json({ success: false })
    })
})


router.post('/sign-out', (req, res) => {
    User.findOne({ token: req.body.token }, (err, user) => {
        if (user) {
            user.login = false

            user.save(err => {
                if (!err) res.json({ success: true })

                else res.json({ success: false })
            })
        } else res.json({ success: false })
    })
})


router.get('/is-auth', (req, res) => {
    User.findOne({ token: req.query.token }, (err, user) => {
        if (user) res.json({ auth: user.login })

        else res.json({ success: false })
    })
})


module.exports = router