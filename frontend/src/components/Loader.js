import React from 'react'

// компонент loader для отображения значка загрузки в момент ожидания

export const Loader = () => {

    // jsx разметка
    return (
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
            <div className="preloader-wrapper active">
                <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
                </div>
            </div>
        </div>
    )
}