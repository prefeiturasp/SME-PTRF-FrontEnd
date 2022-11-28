import React, {memo, useCallback, useEffect, useState} from "react";
import {
    getContasDaAssociacao,
    getExtratosBancariosAjustes,
    getTemAjustesExtratos
} from "../../../services/dres/PrestacaoDeContas.service";
import Loading from "../../../utils/Loading";

// Hooks Personalizados
import {
    useCarregaPrestacaoDeContasPorUuid
} from "../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import TabsAjustesEmExtratosBancarios from "./TabsAjustesEmExtratosBancarios";
import TabelaAcertosEmExtratosBancarios from "./TabelaAcertosEmExtratosBancarios";
import {visoesService} from "../../../services/visoes.service";
import {RelatorioAposAcertos} from './RelatorioAposAcertos'
import AcertosLancamentos from "./AcertosLancamentos";
import AcertosDocumentos from "./AcertosDocumentos";

const ExibeAcertosEmLancamentosEDocumentosPorConta = ({
                                                          exibeBtnIrParaPaginaDeAcertos = true,
                                                          exibeBtnIrParaPaginaDeReceitaOuDespesa = false,
                                                          prestacaoDeContasUuid,
                                                          analiseAtualUuid,
                                                          editavel
                                                      }) => {

    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacaoDeContasUuid)

    const [exibeAcertosNosExtratos, setExibeAcertosNosExtratos] = useState(true);
    const [extratosBancariosAjustes, setExtratosBancariosAjustes] = useState(null);
    const [contasAssociacao, setContasAssociacao] = useState([])
    const [loadingExtratosBancarios, setLoadingExtratosBancarios] = useState(true)
    const [contaUuidAjustesExtratosBancarios, setContaUuidAjustesExtratosBancarios] = useState('')
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [clickBtnEscolheContaExtratosBancarios, setClickBtnEscolheContaExtratosBancarios] = useState({0: true});

    const toggleBtnEscolheContaExtratosBancarios = (id) => {
        if (id !== Object.keys(clickBtnEscolheContaExtratosBancarios)[0]) {
            setClickBtnEscolheContaExtratosBancarios({
                [id]: !clickBtnEscolheContaExtratosBancarios[id]
            });
        }
    };

    const carregaDadosDasContasDaAssociacao = useCallback(async () => {
        if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid) {
            let contas = await getContasDaAssociacao(prestacaoDeContas.associacao.uuid);
            setContasAssociacao(contas);
        }
    }, [prestacaoDeContas]);

    useEffect(() => {
        carregaDadosDasContasDaAssociacao()
    }, [carregaDadosDasContasDaAssociacao, analiseAtualUuid])

    const consultaSeTemAjustesExtratos = useCallback(async () => {
        /*
            Essa função é necessária para verificar se a algum ajuste de extrato nessa analise, independente da conta,
            o retorno da API irá determinar se o bloco "Acertos nas informações de extratos bancários"
            deve ser exibido
        */

        setExibeAcertosNosExtratos(false);
        let tem_ajustes_extratos = await getTemAjustesExtratos(analiseAtualUuid);

        if (tem_ajustes_extratos && tem_ajustes_extratos.length > 0) {
            setExibeAcertosNosExtratos(true);
        } else {
            setExibeAcertosNosExtratos(false);
        }

    }, [analiseAtualUuid])

    const carregarAjustesExtratosBancarios = useCallback(async (conta_uuid) => {
        setContaUuidAjustesExtratosBancarios(conta_uuid);
        setLoadingExtratosBancarios(true);
        let extratos_bancarios_ajustes = await getExtratosBancariosAjustes(analiseAtualUuid, conta_uuid);
        setExtratosBancariosAjustes(extratos_bancarios_ajustes)
        setLoadingExtratosBancarios(false);
    }, [analiseAtualUuid])


    useEffect(() => {
        if (contasAssociacao && contasAssociacao.length > 0) {
            // TODO Rever os métodos consultaSeTemAjustesExtratos. Repete a consulta da API feira por carregarAjustesExtratosBancarios
            consultaSeTemAjustesExtratos();

           // Historia 77618 - Sprint 53
           let periodo_conta_ajustes_extratos_bancarios = JSON.parse(localStorage.getItem('periodoContaAcertosEmExtratosBancarios'));
           if (periodo_conta_ajustes_extratos_bancarios && periodo_conta_ajustes_extratos_bancarios.conta){
                carregarAjustesExtratosBancarios(periodo_conta_ajustes_extratos_bancarios.conta);
                toggleBtnEscolheContaExtratosBancarios(periodo_conta_ajustes_extratos_bancarios.conta)
            }else {
                carregarAjustesExtratosBancarios(contasAssociacao[0].uuid);
                toggleBtnEscolheContaExtratosBancarios(contasAssociacao[0].uuid)
            }
            setClickBtnEscolheConta({0: true})
        }

    }, [contasAssociacao, carregarAjustesExtratosBancarios, consultaSeTemAjustesExtratos])


    return (
        <>
            {/*INICIO*/}

            {exibeAcertosNosExtratos &&
                <>
                    <h5 className="mb-4 mt-4"><strong>Acertos nas informações de extratos bancários</strong></h5>
                    <TabsAjustesEmExtratosBancarios
                        contasAssociacao={contasAssociacao}
                        carregarAjustesExtratosBancarios={carregarAjustesExtratosBancarios}
                        toggleBtnEscolheContaExtratoBancario={toggleBtnEscolheContaExtratosBancarios}
                        clickBtnEscolheContaExtratoBancario={clickBtnEscolheContaExtratosBancarios}
                    >
                        {loadingExtratosBancarios ? (
                                <Loading
                                    corGrafico="black"
                                    corFonte="dark"
                                    marginTop="0"
                                    marginBottom="0"
                                />
                            ) :
                            <>
                                <TabelaAcertosEmExtratosBancarios
                                    contasAssociacao={contasAssociacao}
                                    extratosBancariosAjustes={extratosBancariosAjustes}
                                    contaUuidAjustesExtratosBancarios={contaUuidAjustesExtratosBancarios}
                                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                                />
                            </>
                        }

                    </TabsAjustesEmExtratosBancarios>
                    <hr className="mt-4 mb-3"/>
                </>
            }

            {/*FIM*/}


            <>
                <AcertosLancamentos
                    analiseAtualUuid={analiseAtualUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    exibeBtnIrParaPaginaDeAcertos={exibeBtnIrParaPaginaDeAcertos}
                    exibeBtnIrParaPaginaDeReceitaOuDespesa={exibeBtnIrParaPaginaDeReceitaOuDespesa}
                    editavel={editavel}
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                />

                {analiseAtualUuid &&
                    <AcertosDocumentos
                        analiseAtualUuid={analiseAtualUuid}
                        prestacaoDeContas={prestacaoDeContas}
                        prestacaoDeContasUuid={prestacaoDeContasUuid}
                    />
                }


                {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' ?
                <RelatorioAposAcertos
                    prestacaoDeContasUuid={prestacaoDeContasUuid}
                    prestacaoDeContas={prestacaoDeContas}
                    analiseAtualUuid={analiseAtualUuid}
                    podeGerarPrevia={true}
                /> : null}

            </>
        </>
    )
}
export default memo(ExibeAcertosEmLancamentosEDocumentosPorConta)