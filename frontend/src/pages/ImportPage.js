import React, { useState, useEffect } from 'react'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

// страница для импорта файлов в базу данных 

export const ImportPage = () => {

    // подтягивание хуков
    const {loading, request, error, clearError} = useHttp()
    const message = useMessage()

    // инициализируем state
    const [form, setForm] = useState({
        filename : ''
    })

    // функция, которая реагируем на изменения поля инпута и изменяем текущий state
    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    // функция для отправления запроса на сервер для импорта файла в базу
    const importHandler = async () => {
        try {
            const data = await request('/api/main/import',
                'POST',
                {...form}
            )
            message(data.message)
        } catch (err) {}
    }

    
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    // разметка jsx
    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <div className="card ">
                    <div className="card-content black-text">
                        <span className="card-title">Import File</span>
                        <div style={{margin : 10}}>
                            <div className="input-field ">
                                <span>Выберите файл из папки files</span>
                                <hr></hr>
                                <input 
                                    id="filename" 
                                    type="file" 
                                    name='filename'
                                    onChange={changeHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button 
                            className='btn yellow darken-4'
                            onClick={importHandler}
                            disabled={loading}
                        >
                            Импортировать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}