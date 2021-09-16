import {useEffect, useState} from "react";
import {getPrestacaoDeContasDetalhe} from "../../../services/dres/PrestacaoDeContas.service";

export const useCarregaPrestacaoDeContasPorUuid = (prestacao_conta_uuid) =>{

    const [prestacaoDeContas, setPrestacaoDeContas] = useState({})

    useEffect(()=>{

        let mounted = true;

        const carregaPrestacaoDeContasPorUuid = async () => {
            let prestacao = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
            if (mounted){
                setPrestacaoDeContas(prestacao)
            }
        };
        carregaPrestacaoDeContasPorUuid()
        return () =>{
            mounted = false;
        }
    }, [prestacao_conta_uuid])
    return prestacaoDeContas
}