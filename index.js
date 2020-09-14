const express = require('express')
const config = require('config')
const mysql = require("mysql")

// создание приложения-сервера
const app = express()

app.use(express.json())

// подключение роутов для апросов на сервер
app.use('/api/main', require('./routes/main_route'))

// подтягивание настроек из файлв конфигурации
const PORT = config.get('port') || 5000
const HOSTNAME = config.get('hostname') || 'localhost'
const USERNAME = config.get('username') || 'root'
const PASSWORD = config.get('password') || 'root'
const DBNAME = config.get('databasename') || 'task1'

// функция запуска сервера
async function start() {
    try {
        let con = mysql.createConnection({ 
            host: HOSTNAME, 
            user: USERNAME, 
            password: PASSWORD, 
            database: DBNAME, 
        }) 

        // подключение к базе MySQL 
        await con.connect(err => {
            if(err) {
                throw err
            } else {
                console.log('Connetted to MySql!')
            }
        })

        // запуск сервера на заданном порте
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (err) {
        console.log('Error', err.message)
        process.exit(1)
    }
}

start()
