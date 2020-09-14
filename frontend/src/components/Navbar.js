import React from 'react'
import {NavLink} from 'react-router-dom'

//компонент  Navbar

export const Navbar = () => {
    // jsx разметка
    return (
        <nav className='sticky'>
            <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem'}}>
                <span className="brand-logo">Task 2 </span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to='/import'>Импорт в MySql</NavLink></li>
                    <li><NavLink to='/list'>Список файлов</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}