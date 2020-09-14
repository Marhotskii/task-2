import React, { useState, useCallback, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { FileTable } from '../components/FileTable'
import {useParams} from 'react-router-dom'
import { Loader } from '../components/Loader'

// страница для отображения данных из файла в виде exel файла
export const TablePage = () => {

    const [data, setData] = useState(null)
    const {request, loading} = useHttp()

    // получение параметра id из url
    const fileId = useParams().id

    // отправка запроса на сервер для получения данных для опеделенного по id файла
    const getData = useCallback( async () => {
        try {
            const fetched = await request(`/api/main/files/${fileId}`, 'GET')
            setData(fetched)
        } catch (err) {}
        
    }, [fileId, request])

    useEffect(() => {
        getData()
    }, [getData])


    // если данные еще грузятся, отображаем компонент loader
    if (loading){
        return <Loader/>
    }

    // отображение компонента FileTable для представления данных в виде exel 
    return (
        <>
            { !loading && data && <FileTable data={data}/>}
        </>
    )
}