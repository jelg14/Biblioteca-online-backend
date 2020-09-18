'use strict'

const mongoose = require('mongoose');
const app = require('../src/app');

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/2018169', { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true }).then(() => {
    console.log('Se encuentra conectado a la base de datos');

    app.set('port', process.env.PORT || 3000)
    app.listen(app.get('port'), () => {
        console.log(`El servidor esta conectado al puerto: ${app.get('port')}`);
    })
}).catch(err => console.log(err))