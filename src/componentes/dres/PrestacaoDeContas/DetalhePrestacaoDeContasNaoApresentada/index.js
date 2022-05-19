import React, {useEffect, useState} from "react";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import Cabecalho from "../DetalhePrestacaoDeContas/Cabecalho";
import {BotoesAvancarRetroceder} from "../DetalhePrestacaoDeContas/BotoesAvancarRetroceder";
import {TrilhaDeStatus} from "../DetalhePrestacaoDeContas/TrilhaDeStatus";
import {getTabelasPrestacoesDeContas} from "../../../../services/dres/PrestacaoDeContas.service";
import {FormRecebimentoPelaDiretoria} from "../DetalhePrestacaoDeContas/FormRecebimentoPelaDiretoria";

export const DetalhePrestacaoDeContasNaoApresentada = () =>{

    const prestacaoDeContas = JSON.parse(localStorage.getItem('prestacao_de_contas_nao_apresentada'));

    const initialFormRecebimentoPelaDiretoria = {
        tecnico_atribuido: "",
        data_recebimento: "",
        status: "NAO_APRESENTADA",
    };

    const [stateFormRecebimentoPelaDiretoria] = useState(initialFormRecebimentoPelaDiretoria);
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});

    useEffect(()=>{
        carregaTabelaPrestacaoDeContas();
    }, []);

    const carregaTabelaPrestacaoDeContas = async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    };

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                    <>
                        {prestacaoDeContas &&
                            <>
                            <Cabecalho
                                prestacaoDeContas={prestacaoDeContas}
                                exibeSalvar={false}
                            />
                                <BotoesAvancarRetroceder
                                    prestacaoDeContas={prestacaoDeContas}
                                    textoBtnAvancar={"Receber"}
                                    textoBtnRetroceder={"Reabrir PC"}
                                    metodoAvancar={undefined}
                                    metodoRetroceder={undefined}
                                    disabledBtnAvancar={true}
                                    disabledBtnRetroceder={true}
                                />
                                <TrilhaDeStatus
                                    prestacaoDeContas={prestacaoDeContas}
                                />
                                <FormRecebimentoPelaDiretoria
                                    handleChangeFormRecebimentoPelaDiretoria={undefined}
                                    stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                                    tabelaPrestacoes={tabelaPrestacoes}
                                    disabledNome={true}
                                    disabledData={true}
                                    disabledStatus={true}
                                    exibeMotivo={false}
                                    exibeRecomendacoes={false}
                                />
                            </>
                        }
                    </>
            </div>
        </PaginasContainer>
    )
};