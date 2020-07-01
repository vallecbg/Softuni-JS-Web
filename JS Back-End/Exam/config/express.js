const express = require('express')
const User = require('../handlers/users/User')
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars')
const { cookie } = require('../config/config')
const jwt = require('../utils/jwt')

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

module.exports = (app) => {
    app.engine('hbs', handlebars({
        layoutsDir: 'views',
        defaultLayout: 'base-layout',
        partialsDir: 'views/partials',
        extname: 'hbs',
        helpers: {
            toDate: function (date) { 
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
            toFullDate: function (date) { 
                return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            },
        }
    }))

    app.use(express.static('public'))
    app.set('view-engine', 'hbs')
    app.use(express.json())
    app.use(cookieParser())
    app.use(express.urlencoded({extended: false}))
}