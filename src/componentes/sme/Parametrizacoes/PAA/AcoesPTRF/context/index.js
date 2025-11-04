import { createContext, useMemo, useState } from 'react';

export const AcoesPTRFPaaContext = createContext({
    patchingLoadingUUID: null,
    setPatchingLoadingUUID: () => {},
})

export const AcoesPTRFPaaProvider = ({children}) => {

    const [patchingLoadingUUID, setPatchingLoadingUUID] = useState('');

    const contextValue = useMemo(() => {
        return {
            patchingLoadingUUID,
            setPatchingLoadingUUID
        };
    }, [patchingLoadingUUID]);

    return (
        <AcoesPTRFPaaContext.Provider value={contextValue}>
            {children}
        </AcoesPTRFPaaContext.Provider>
    )

}