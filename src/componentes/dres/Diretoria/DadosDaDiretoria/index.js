import React, {useEffect, useState} from "react";
import {getAssociacao} from "../../../../services/dres/Associacoes.service";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";

export const DadosDaDiretoria = () => {
    const [dadosDiretoria, setDadosDiretoria] = useState(null);

    useEffect(() => {
        buscaDiretoria()
    }, []);

    const buscaDiretoria = async () => {
        let diretoria = await getAssociacao(localStorage.getItem(ASSOCIACAO_UUID));
        console.log("Diretoria ", diretoria.unidade.dre.nome)
        setDadosDiretoria(diretoria.unidade)
    };

    return (
        <>
            {dadosDiretoria ? (
                <>
                    <div className="d-flex bd-highlight">
                        <div className="p-2 flex-grow-1 bd-highlight">
                            <h1 className="titulo-itens-painel mt-5">Dados da diretoria {dadosDiretoria.dre.nome}</h1>
                        </div>
                    </div>
                    <div className="page-content-inner">
                        <h4>AQUIAASDFASDF</h4>
                    </div>
                </>
            ) : null}
        </>
    )
}