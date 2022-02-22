import {useEffect, useState} from "react";
import {getRepassesPendentes} from "../../services/escolas/AtasAssociacao.service";

export const useCarregaRepassesPendentesPorPeriodoAteAgora = (associacaoUuid, periodoUuid) => {

    const [repassesPendentes, setRepassesPendentes] = useState([])
    
    useEffect(()=>{
        let mounted = true;
        
        const retornaRepassesPendentes = async () => {
            if (associacaoUuid && periodoUuid){
                let repasses = await getRepassesPendentes(associacaoUuid, periodoUuid)
                if (mounted) {
                    setRepassesPendentes(repasses)
                }
            }
        }
        retornaRepassesPendentes()
        return () =>{
            mounted = false;
        }

    }, [associacaoUuid, periodoUuid])
    return repassesPendentes
}
