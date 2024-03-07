import React, {createContext, useCallback, useMemo, useState} from 'react';
export const PrestacaoContaReprovadaNaoApresentacaoContext = createContext({
    prestacaoContaReprovadaNaoApresentacaoUuid: '',
    setPrestacaoContaReprovadaNaoApresentacaoUuid: () => {},
})

export const PrestacaoContaReprovadaNaoApresentacaoProvider = ({children}) => {

    const [prestacaoContaReprovadaNaoApresentacaoUuid, setPrestacaoContaReprovadaNaoApresentacaoUuid] = useState('Ollyver');

    const contextValue = useMemo(() => {
        return{
            prestacaoContaReprovadaNaoApresentacaoUuid,
            setPrestacaoContaReprovadaNaoApresentacaoUuid,
        }
    }, [prestacaoContaReprovadaNaoApresentacaoUuid])

    return (
        <PrestacaoContaReprovadaNaoApresentacaoContext.Provider value={contextValue}>
            {children}
        </PrestacaoContaReprovadaNaoApresentacaoContext.Provider>
    )
}



// import React, {createContext, useMemo, useState} from 'react';
// export const PrestacaoContaReprovadaNaoApresentacaoContext = createContext({
//     prestacaoContaReprovadaNaoApresentacaoUuid: '',
//     setPrestacaoContaReprovadaNaoApresentacaoUuid: () => {}
// })
//
// export const PrestacaoContaReprovadaNaoApresentacaoProvider = ({children}) =>{
//
//     const [prestacaoContaReprovadaNaoApresentacaoUuid, setPrestacaoContaReprovadaNaoApresentacaoUuid] = useState('');
//
//     const contextValue = useMemo(() => {
//         return{
//             prestacaoContaReprovadaNaoApresentacaoUuid,
//             setPrestacaoContaReprovadaNaoApresentacaoUuid,
//         }
//     }, [prestacaoContaReprovadaNaoApresentacaoUuid, setPrestacaoContaReprovadaNaoApresentacaoUuid])
//
//     return(
//         <PrestacaoContaReprovadaNaoApresentacaoContext.Provider value={contextValue}>
//             {children}
//         </PrestacaoContaReprovadaNaoApresentacaoContext.Provider>
//     )
// }


