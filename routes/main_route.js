const {Router} = require('express')
const mysql = require("mysql")
const config = require('config')
const router = Router()
const path = require('path')
const insertIntoMysql = require('../logic/insertIntoMysql') // функция для импорта данных в базу данных

// route /api/main/import
// импорт файла в базу данных
router.post('/import', async (req, res) => {
    try {
        const {filename} = req.body
        const file = path.basename(filename)
        const result = insertIntoMysql(file)
        res.status(201).json({message: result.message})
    } catch (error) {
        res.status(500).json({message : 'что-то пошло не так'})
    }
})

// route /api/main/files
// выбор всех загруженных файлов в базу данных
router.get('/files', async (req, res) => {
    try {

        // подтягивание настроек из конфигурационного файла
        const HOSTNAME = config.get('hostname') || 'localhost'
        const USERNAME = config.get('username') || 'root'
        const PASSWORD = config.get('password') || 'root'
        const DBNAME = config.get('databasename') || 'task1'
        try {
            let con = mysql.createConnection({ 
                host: HOSTNAME, 
                user: USERNAME, 
                password: PASSWORD, 
                database: DBNAME, 
            }) 

            // подключение к базе данных
            con.connect(err => {
                if (err) {
                    console.log(err)
                }
            })
            
            // запрос в базу данных для выбора всех загруженных файлов в базу
            const sqlRequest =`SELECT FILE_NM FROM task1.files`

            // отправка запроса 
            // в результате массив всех загруженных файлов 
            con.query(sqlRequest, (err, results, fields) => { 
                result = []
                results.map(arr => {
                    result.push(arr['FILE_NM'])
                })
                res.status(201).json(result)
            })
            
        } catch (e) {
            return {error: e.message}
        }
        
    } catch (err) {
        res.status(500).json({message : 'что-то пошло не так'})
    }
})

// получение всех данных из конкретного файла из списка всех загруженных файлов
router.get('/files/:id', async (req, res) => {
    try {

        // получение параметр id из url
        const fileId = req.params.id

        // подтягивание настроек из файла конфигураций
        const HOSTNAME = config.get('hostname') || 'localhost'
        const USERNAME = config.get('username') || 'root'
        const PASSWORD = config.get('password') || 'root'
        const DBNAME = config.get('databasename') || 'task1'
        try {
            let con = mysql.createConnection({ 
                host: HOSTNAME, 
                user: USERNAME, 
                password: PASSWORD, 
                database: DBNAME, 
            }) 

            // подключение к базе данных
            con.connect(err => {
                if (err) {
                    console.log(err)
                }
            })

            // запрос на выборку всех данных для загруженного файла
            const sqlRequest =(`
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class1
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class1
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
                    
                union
                
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class2
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class2
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
                    
                union
                
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class3
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class3
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
                    
                union    
                    
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class4
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class4
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
                    
                union    
                    
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class5
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class5
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
                    
                union    
                    
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class6
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class6
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
                    
                    
                union    
                    
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class7
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class7
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
                    
                union    
                    
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class8
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class8
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
                    
                union    
                    
                SELECT 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                FROM task1.class9
                WHERE FILE_NM = 
                (select file_nm from task1.files where id = ?)
                
                union
                
                SELECT 
                    sum(BAL_ACCT) as BAL_ACCT
                    ,sum(OPN_BAL_ASSET) as OPN_BAL_ASSET
                    ,sum(OPN_BAL_PASSVE) as OPN_BAL_PASSVE
                    ,sum(TRNVR_DBT) as TRNVR_DBT
                    ,sum(TRNVR_CRDT) as TRNVR_CRDT
                    ,sum(OUTGNG_BAL_ASSET) as OUTGNG_BAL_ASSET
                    ,sum(OUTGNG_BAL_PASSVE) as OUTGNG_BAL_PASSVE
                FROM task1.class9
                WHERE BAL_ACCT < 100 and FILE_NM = 
                    (select file_nm from task1.files where id = ?)
            `)
            
            // параметр id для sql - запроса на сервер
            items = []
            for (let i =0; i < 18; i++){
                items.push(fileId)
            }

            // отправка запроса
            // в ответе массив объектов из всех данных для загруженного файла
            con.query(sqlRequest, items, (err, results, fields) => { 
                res.status(201).json(results)
            })

        } catch( err) {
            res.status(500).json({message : 'что-то пошло не так'})
        }
    } catch (err) {
        res.status(500).json({message : 'что-то пошло не так'})
    }
})

module.exports = router