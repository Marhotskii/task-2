import {useCallback} from 'react'

// хук для вывода уведомительных сообщений с помощью toast 

export const useMessage = () => {
    return useCallback(text => {
        if (window.M && text) {
            window.M.toast({html: text})
        }
    }, [])
}