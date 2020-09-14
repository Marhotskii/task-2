import React, { useState, useCallback, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { FilesList } from '../components/FilesList'


// страница со списком загруженных в базу файлов

export const ListPage = () => {

    // подтягивание хуков
    const [files, setFiles] = useState([])
    const {loading, request} = useHttp()

    // get запрос на сервер для получения загруженных файлов
    const fetchFiles = useCallback(async () => {
        try {
            const fetched = await request('/api/main/files', 'GET', null, {}) // ожидание ответа от сервера
            setFiles(fetched) // обновляем state
        } catch(err) {}
    }, [request])

    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    // компонент FileList для отображения списка файлов
    return (
        <>
            {!loading && <FilesList files={files}/>}
        </>
    )
}