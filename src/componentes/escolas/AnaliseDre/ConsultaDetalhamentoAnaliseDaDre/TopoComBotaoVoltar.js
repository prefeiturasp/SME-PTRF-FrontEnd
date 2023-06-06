import React, {useEffect, useState, useContext} from "react";
import { useHistory } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {getPeriodoPorUuid} from "../../../../services/sme/Parametrizacoes.service";
import {getStatusPeriodoPorData} from "../../../../services/escolas/PrestacaoDeContas.service";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import { SidebarLeftService } from "../../../../services/SideBarLeft.service";
import { SidebarContext } from "../../../../context/Sidebar";

export const TopoComBotaoVoltar = ({statusPc, prestacaoContaUuid, onClickVoltar, periodoFormatado, periodoUuid, podeAbrirModalAcertos, devolucaoAtualSelecionada}) => {

    const [periodo, setPeriodo] = useState(null);
    const history = useHistory()
    const contextSideBar = useContext(SidebarContext);

    useEffect( () => {
        verificaSePodeIrParaConcluidas()
    }, [statusPc, devolucaoAtualSelecionada])

    const verificaSePodeIrParaConcluidas = () => {
        if (statusPc === 'DEVOLVIDA' && devolucaoAtualSelecionada) {
            return true
        }
        return false
    }

    const getStatusPrestacaoDeConta = async (periodo) => {
        if (periodo){
            let data_inicial = periodo.data_inicio_realizacao_despesas;
            return await getStatusPeriodoPorData(localStorage.getItem(ASSOCIACAO_UUID), data_inicial);
        }
    };

    useEffect( () => {
        (async() => {
            if (periodoUuid){
                const periodo = await getPeriodoPorUuid(periodoUuid);
                setPeriodo(periodo)
            }
        })()
    }, [periodoUuid])

    const temAcertosPendententes = async () => {
        const statusPc = await getStatusPrestacaoDeConta(periodo);
        return statusPc?.prestacao_contas_status?.tem_acertos_pendentes
    }

    const handleVerificaAcertos = async () => {
        if (await temAcertosPendententes()){
            podeAbrirModalAcertos()
        }
        else {
            localStorage.setItem('uuidPrestacaoConta', prestacaoContaUuid);
            localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify({data_final: periodo.data_fim_realizacao_despesas , data_inicial: periodo.data_inicio_realizacao_despesas  , periodo_uuid: periodo.uuid}));
            irParaGeracaoDocumento();
        }
    }

    const irParaGeracaoDocumento = () => {
        // Ao setar para false, quando a função a seguir setar o click do item do menu
        // a pagina não ira automaticamente para a url do item

        contextSideBar.setIrParaUrl(false)
        SidebarLeftService.setItemActive("geracao_documento")

        // Necessário voltar o estado para true, para clicks nos itens do menu continuarem funcionando corretamente
        contextSideBar.setIrParaUrl(true)
        history.push(`/prestacao-de-contas/`)
    }

    return(
        <div className="d-flex bd-highlight align-items-center">
            <div className="flex-grow-1 bd-highlight texto-periodo-topo">
                <p className='mb-2'>{periodoFormatado && periodoFormatado.referencia ? periodoFormatado.referencia : ''} - {periodoFormatado && periodoFormatado.data_inicio_realizacao_despesas ? periodoFormatado.data_inicio_realizacao_despesas : '-'} até {periodoFormatado && periodoFormatado.data_fim_realizacao_despesas ? periodoFormatado.data_fim_realizacao_despesas : '-'}</p>
                <h1 className="titulo-itens-painel">Devolução para acertos</h1>
            </div>
            <div className="p-2 bd-highlight">
                <button onClick={onClickVoltar} className="btn btn-outline-success ml-2"><FontAwesomeIcon
                    style={{marginRight: "5px", color: '#00585E'}}
                    icon={faArrowLeft}
                />
                    Voltar
                </button>
            </div>
            <div className="p-3 bd-highlight">
                {verificaSePodeIrParaConcluidas() ?
                    <button
                        className="btn btn-success mr-2"
                        onClick={handleVerificaAcertos}
                    >
                        Ir para concluir acerto 
                    </button>
                    : null
                }
            </div>
        </div>
    )
}