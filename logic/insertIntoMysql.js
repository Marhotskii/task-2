const xlsx = require('node-xlsx')
const fs = require('fs')
const path = require('path')
const csvtojson = require('csvtojson')
const mysql = require("mysql")
const config = require('config')

// функция для конвертации файла .xls в .csv для удобного импорта в базу
function convertToCsv(filename) {

    
    const filepath = 'files/' + filename 

    // парсинг .xls в переменную obj
    const obj = xlsx.parse(filepath)

    // корректировка полученного результата
    const data = obj[0].data.filter(arr => Number(arr[0]))
    data.shift()
    
    // строка с заголовквми для csv файла
    res = 'BAL_ACCT,OPN_BAL_ASSET,OPN_BAL_PASSVE,TRNVR_DBT,TRNVR_CRDT,OUTGNG_BAL_ASSET,OUTGNG_BAL_PASSVE,FILE_NM\n'

    // подготовка строки с данными в формате csv с разделителем ','
    data.map( arr => {
        for (let i = 0; i < arr.length; i ++){
            res += arr[i] + ','
        }
        res += filename + '\n'
    })

    // запись преобразованных данных в csv файл  таким же названием
    fs.writeFile(`csv/${filename.slice(0, -4)}.csv`, res.slice(0, -1), (err) => {
        if(err) throw err
    })
}

// функция импорта файла .xls в базу данных
const insertIntoMysql = (filename) => {

    // создаем файл .csv для удобного ипорта в базу данных
    convertToCsv(filename)

    // подтягивание настроек для подключения к базе из файла конфигураций
    const HOSTNAME = config.get('hostname') || 'localhost'
    const USERNAME = config.get('username') || 'root'
    const PASSWORD = config.get('password') || 'root'
    const DBNAME = config.get('databasename') || 'task1'
    
    try{
        let con = mysql.createConnection({ 
            host: HOSTNAME, 
            user: USERNAME, 
            password: PASSWORD, 
            database: DBNAME, 
        }) 

        // подключение к базе
        con.connect(err => console.log(err))
        

        // Перед записью в таблицу предварительно ее очищаем, чтобы не было дублирования записей
        con.query('truncate table HEAP;', (err, results, fields) => console.log(err))
    
        // считывание данных из файла .csv
        csvtojson().fromFile('csv/'+filename.slice(0, -3)+'csv').then(source => { 
      
            // Fetching the data from each row  
            for (let i = 0; i < source.length; i++) { 
                const BAL_ACCT = source[i]["BAL_ACCT"], 
                    OPN_BAL_ASSET = source[i]["OPN_BAL_ASSET"], 
                    OPN_BAL_PASSVE = source[i]["OPN_BAL_PASSVE"], 
                    TRNVR_DBT = source[i]["TRNVR_DBT"],
                    TRNVR_CRDT = source[i]["TRNVR_CRDT"],
                    OUTGNG_BAL_ASSET = source[i]["OUTGNG_BAL_ASSET"],
                    OUTGNG_BAL_PASSVE = source[i]["OUTGNG_BAL_PASSVE"]
                var FILE_NM = source[i]["FILE_NM"]

                // sql - запрос для вставки данных в базу в черновую таблицу heap
                const insertStatement =  
                `INSERT INTO heap (BAL_ACCT
                                    ,OPN_BAL_ASSET
                                    ,OPN_BAL_PASSVE
                                    ,TRNVR_DBT
                                    ,TRNVR_CRDT
                                    ,OUTGNG_BAL_ASSET
                                    ,OUTGNG_BAL_PASSVE
                                    ,FILE_NM) values(?, ?, ?, ?, ?, ?, ?, ?);`

                // параметры для sql - запроса
                const items = [
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                    ,FILE_NM
                ]
          
                // Inserting data of current row 
                // into database 
                con.query(insertStatement, items,  
                    (err, results, fields) => { 
                    if(err){
                        return console.log(err)
                    }
                })
            } 

            // запрос для записи только уникального названия файла в базу данных
            let insertStatement = `
                insert into task1.files (file_nm)
                select 
                    ?
                where 
                not exists (
                    select * from task1.files where file_nm = ?
                );`

            // параметры для sql - запроса
            items = [FILE_NM, FILE_NM]

            // запись уникального названия файла в базу данных
            con.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                    console.log(err)
                }
            })

            // sql - запрос для распределения данных из черновой таблицы heap 
            // по подготовленным таблицам class для удобного хранения в базе
            insertStatement = 
                `insert into task1.class? (
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                    ,FILE_NM 
                )
                (select 
                    BAL_ACCT
                    ,OPN_BAL_ASSET
                    ,OPN_BAL_PASSVE
                    ,TRNVR_DBT
                    ,TRNVR_CRDT
                    ,OUTGNG_BAL_ASSET
                    ,OUTGNG_BAL_PASSVE
                    ,FILE_NM    
                from 
                    task1.heap 
                where 
                    substring(BAL_ACCT, 1, 1) = ?);`

            // параметры для sql - запроса
            items = []

            // запись данных из черновой таблицы heap в аблицы class1-9
            for (let i = 1; i < 10; i++){
                items[0] = i
                items[1] = i
                
                con.query(insertStatement, items,  
                    (err, results, fields) => { 
                    if(err){
                        console.log(err)
                    }
                })
            }

            // Убираем защищенный режим обновления, чтобы можно было удалить дубликаты из базы
            con.query(`SET SQL_SAFE_UPDATES = 0;` ,(err, results, fields) => {
                if(err) {
                    console.log(err)
                }
            })

            // sql - запрос для удаления дубликатов из таблиц class1-9
            insertStatement = `
                DELETE me.* FROM 
                    task1.class? as me, task1.class? as cl 
                WHERE 
                    me.BAL_ACCT = cl.BAL_ACCT AND 
                    me.FILE_NM = cl.FILE_NM AND 
                    me.ID > cl.ID;`
            
            items = []

            // удаление дубликатов из таблиц class1-9
            for (let i = 1; i < 10; i++){
                items[0] = i
                items[1] = i
                
                con.query(insertStatement, items,  
                    (err, results, fields) => { 
                    if(err){
                        console.log(err)
                    }
                })
            }
            
        })
        return {message: 'Импорт завершился успешно'}
    } catch (e) {
        return {error: e.message}
    }
}


module.exports = insertIntoMysql
