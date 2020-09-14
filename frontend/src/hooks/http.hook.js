import {useState, useCallback} from 'react'

// хук для более простого и корректного обращения к серверу

export const useHttp = () => {

    // инициализация state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // функция запросв с указанными полямми
    const request = useCallback( async (url, method, body=null, headers={}) => {
        setLoading(true)
        try {
            if (body){
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            // ожидание ответа от сервера
            const response = await fetch(url, {method, body, headers})
            const data = await response.json()
            
            // проверка статуса ответа
            if(!response.ok){
                throw new Error(data.message || 'Smth going wrong')
            }
            setLoading(false)

            return data
        } catch (err) {
            setLoading(false)
            setError(err.message)
            throw err
        }
    }, [])

    // функция очистки стейта ошибки
    const clearError = useCallback(() => setError(null), [])

    return { loading, request, error, clearError}
}