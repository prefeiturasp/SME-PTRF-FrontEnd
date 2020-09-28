import React, {useEffect, useState} from "react";
import {useParams, Redirect} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPrestacaoDeContasDetalhe} from "../../../../services/dres/PrestacaoDeContas.service";
import {Cabecalho} from "./Cabecalho";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {BotoesAvancarRetroceder} from "./BotoesAvancarRetroceder";
import {FormRecebimentoPelaDiretoria} from "./FormRecebimentoPelaDiretoria";

export const DetalhePrestacaoDeContas = () =>{
    let {prestacao_conta_uuid} = useParams();

    const [prestacaoDeContas, setPrestacaoDeContas] = useState({});
    const [dataRecebimento, setDataRecebimento] = useState("");

    useEffect(()=>{
        carregaPrestacaoDeContas();
    }, []);

    const carregaPrestacaoDeContas = async () => {
        if (prestacao_conta_uuid){
            let prestacao = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
            setPrestacaoDeContas(prestacao);
            setDataRecebimento(prestacao.data_recebimento);
        }
    };

    const receberPrestacaoDeContas = async ()=>{
        console.log("Cliquei em receberPrestacaoDeContas ", dataRecebimento)
    };

    const reabrirPrestacaoDeContas = async ()=>{
        console.log("Cliquei em reabrirPrestacaoDeContas ")

    };


    console.log("Prestacao XXXXXX ", prestacaoDeContas)

    const handleChangeDataRecebimento = (name, valor) =>{
        console.log("handleChangeDataRecebimento ", name);
        console.log("handleChangeDataRecebimento ", valor);
        setDataRecebimento(valor)
    };

    const getComportamentoPorStatus = () =>{
        if (prestacaoDeContas.status === 'NAO_RECEBIDA'){
            return (
                <>
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Receber"}
                        textoBtnRetroceder={"Reabrir PC"}
                        metodoAvancar={receberPrestacaoDeContas}
                        metodoRetroceder={reabrirPrestacaoDeContas}
                        disabledBtnAvancar={!dataRecebimento}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        prestacaoDeContas={prestacaoDeContas}
                        dataRecebimento={dataRecebimento}
                        handleChangeDataRecebimento={handleChangeDataRecebimento}
                    />
                </>
            )

        }

    };

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
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
                        {getComportamentoPorStatus()}
                    </>
                }
            </div>
        </PaginasContainer>
    )
};