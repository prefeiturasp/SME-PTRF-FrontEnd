import React, {useEffect, useState} from "react";
import {useParams, Redirect} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPrestacaoDeContasDetalhe} from "../../../../services/dres/PrestacaoDeContas.service";
import {Cabecalho} from "./Cabecalho";

export const DetalhePrestacaoDeContas = () =>{
    let {prestacao_conta_uuid} = useParams();

    const [prestacaoDeContas, setPrestacaoDeContas] = useState({});

    useEffect(()=>{
        carregaPrestacaoDeContas();
    }, []);

    const carregaPrestacaoDeContas = async () => {
        if (prestacao_conta_uuid){
            let prestacao = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
            console.log('Prestacao XXXXX ', prestacao);
            setPrestacaoDeContas(prestacao)
        }
    };

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>

            {!prestacao_conta_uuid ? (
                    <Redirect
                        to={{
                            pathname: `/dre-lista-prestacao-de-contas/`,
                        }}
                    />
                ) :

                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>

            }

        </PaginasContainer>
    )
};