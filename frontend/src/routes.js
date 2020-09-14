import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { ImportPage } from './pages/ImportPage'
import { ListPage } from './pages/ListPage'
import { TablePage } from './pages/TablePage'

export const useRoutes = () => {
    return (
        <Switch>
            <Route path='/import' exac>
                <ImportPage/>
            </Route>
            <Route path='/list' exac>
                <ListPage/>
            </Route>
            <Route path='/detail/:id'>
                <TablePage/>
            </Route>
            <Redirect to='/import'/>
        </Switch>
    )
}