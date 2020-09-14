import React from 'react'
import {Link} from 'react-router-dom'

// component FileList для отображения списка загруженных файлов

export const FilesList = ({files}) => {

    // если нету загруженных файлов, вывод сообщения от отсутствии файлов
    if (!files.length) {
        return <p className='center'>Файлов нет</p>
    }

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>    
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Название файла</th>
                            <th>Открыть</th>
                        </tr>
                    </thead>

                    <tbody> 
                        { files.map((file, index) => {

                            // по нажатию на кнопку 'открыть' можно посмотреть данные в формате exel для выбранного файла
                            return (
                                <tr key ={index}>
                                    <td>{index + 1}</td>
                                    <td>{file}</td>
                                    <td>
                                        <Link to={`/detail/${index+1}`}>Открыть</Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        
    )
}