import React, {createContext, useState} from 'react';

export const DataLimiteDevolucao = createContext(null)

export function DataLimiteProvider({children}) {
    const [dataLimite, setDataLimite] = useState();

    return (
        <DataLimiteDevolucao.Provider value={
            {dataLimite, setDataLimite}
        }>
            {children}</DataLimiteDevolucao.Provider>
    )
}
