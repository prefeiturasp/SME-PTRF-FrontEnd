import {useEffect, useState} from "react";
import {getDespesasTabelas} from "../../services/escolas/Despesas.service";

export const useCarregaTabelaDespesa = (prestacaoDeContas=null) =>{
    const [tabelasDespesa, setTabelasDespesa] = useState([]);

    useEffect(() => {
        const carregaTabelasDespesa = async () => {
            let resp
            if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid){
                resp = await getDespesasTabelas(prestacaoDeContas.associacao.uuid);
            }else {
                resp = await getDespesasTabelas();
            }
            setTabelasDespesa(resp);
        };
        carregaTabelasDespesa();
    }, [prestacaoDeContas]);

    return tabelasDespesa
}