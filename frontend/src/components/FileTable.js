import React from 'react'

// компонент FileTable дл отображения данных в виде exel

export const FileTable = ({data}) => {
    // jsx разметка
    return (
        <table className="striped">
            <thead >
                <tr className='sticky'>                 
                    <th>Б\сч</th>
                    <th>Входящее сальдо актив</th>        
                    <th>Входящее сальдо пассив</th>
                    <th>Обороты дебет</th>
                    <th>Обороты кредит</th>
                    <th>Исходящее сальдо актив</th>
                    <th>Исходящее сальдо пассив</th>
                </tr>
            </thead>

            <tbody> 
                { data.map((item, index) => {

                    // выделение жирным групированные данные
                    if(item['BAL_ACCT'] < 100){
                        return (
                            <tr key ={index}>
                                
                                <td><strong>{item['BAL_ACCT']}</strong></td>
                                <td><strong>{item['OPN_BAL_ASSET']}</strong></td>
                                <td><strong>{item['OPN_BAL_PASSVE']}</strong></td>
                                <td><strong>{item['TRNVR_DBT']}</strong></td>
                                <td><strong>{item['TRNVR_CRDT']}</strong></td>
                                <td><strong>{item['OUTGNG_BAL_ASSET']}</strong></td>
                                <td><strong>{item['OUTGNG_BAL_PASSVE']}</strong></td>
                            </tr>
                        )
                    } else if (item['BAL_ACCT'] < 1000 && item['BAL_ACCT'] > 100){
                        
                        // добавления поля 'по классу' для агегированных данных для каждого класса
                        return (
                            <tr key ={index}>
                                
                                <td><strong>ПО КЛАССУ</strong></td>
                                <td><strong>{item['OPN_BAL_ASSET']}</strong></td>
                                <td><strong>{item['OPN_BAL_PASSVE']}</strong></td>
                                <td><strong>{item['TRNVR_DBT']}</strong></td>
                                <td><strong>{item['TRNVR_CRDT']}</strong></td>
                                <td><strong>{item['OUTGNG_BAL_ASSET']}</strong></td>
                                <td><strong>{item['OUTGNG_BAL_PASSVE']}</strong></td>
                            </tr>
                        )
                    } else {
                        return (
                            <tr key ={index}>
                                <td>{item['BAL_ACCT']}</td>
                                <td>{item['OPN_BAL_ASSET']}</td>
                                <td>{item['OPN_BAL_PASSVE']}</td>
                                <td>{item['TRNVR_DBT']}</td>
                                <td>{item['TRNVR_CRDT']}</td>
                                <td>{item['OUTGNG_BAL_ASSET']}</td>
                                <td>{item['OUTGNG_BAL_PASSVE']}</td>
                            </tr>
                        )
                    }
                    
                })}
            </tbody>
        </table>
    )
}