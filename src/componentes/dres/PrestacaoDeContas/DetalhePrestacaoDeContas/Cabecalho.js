import React, {memo, useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {getPeriodos} from "../../../../services/sme/DashboardSme.service";
import {exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";

const Cabecalho = ({prestacaoDeContas, exibeSalvar, metodoSalvarAnalise, btnSalvarDisabled}) => {

    const [periodoTexto, setPeriodoTexto] = useState('')
    const [publicacaoTexto, setPublicacaoTexto] = useState('')
    const [retificacaoTexto, setRetificacaoTexto] = useState('')
    const [pcPublicada, setPcPublicada] = useState(false)

    const carregaPeriodo = useCallback(async ()=>{
        if (prestacaoDeContas && prestacaoDeContas.periodo_uuid){
            let periodo_uuid = prestacaoDeContas.periodo_uuid
            let periodos = await getPeriodos(periodo_uuid)
            let periodo_atual = periodos.find(p => p.uuid === prestacaoDeContas.periodo_uuid)
            let periodo_texto = `${periodo_atual.referencia} - ${periodo_atual.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo_atual.data_inicio_realizacao_despesas) : "-"} até ${periodo_atual.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo_atual.data_fim_realizacao_despesas) : "-"}`
            setPeriodoTexto(periodo_texto)
        }
    }, [prestacaoDeContas])

    const verificaPublicacao = useCallback( () => {
    if (prestacaoDeContas && prestacaoDeContas.publicada && !prestacaoDeContas.em_retificacao){
        setPcPublicada(true)
        let textoPublicacao = `Essa PC consta da Publicação ${prestacaoDeContas.referencia_consolidado_dre}`
        setPublicacaoTexto(textoPublicacao)
    }
    }, [prestacaoDeContas])

    const verificaRetificacao = useCallback( () => {
        if (prestacaoDeContas && prestacaoDeContas.em_retificacao && prestacaoDeContas.status){
            let textoRetificacao = ""
            if(prestacaoDeContas.status === "RECEBIDA" || prestacaoDeContas.status === "EM_ANALISE") {
                textoRetificacao = `Essa PC consta da Publicação ${prestacaoDeContas.referencia_consolidado_dre_original}`
            } else if ((prestacaoDeContas.status === "APROVADA" || prestacaoDeContas.status === "REPROVADA" || prestacaoDeContas.status === "APROVADA_RESSALVA") && !prestacaoDeContas.publicada) {
                textoRetificacao = `Essa PC constará da ${prestacaoDeContas.referencia_consolidado_dre}`
            } else if (prestacaoDeContas.publicada){
                textoRetificacao = `Essa PC consta da ${prestacaoDeContas.referencia_consolidado_dre}`
            }
            setRetificacaoTexto(textoRetificacao);
        }
    }, [prestacaoDeContas])

    useEffect(()=>{
        carregaPeriodo()
        verificaPublicacao()
    }, [carregaPeriodo])
    
    useEffect(()=>{
        verificaRetificacao()
    }, [verificaRetificacao])

    const verificaStatusPc = () => {
        if (prestacaoDeContas && prestacaoDeContas.status) {
        switch (prestacaoDeContas.status) {
            case 'RECEBIDA':
            case 'EM_ANALISE':
            case 'EM_PROCESSAMENTO':
            case 'DEVOLVIDA':
            case 'DEVOLVIDA_RECEBIDA':
            case 'DEVOLVIDA_RETORNADA':
            case 'APROVADA':
            case 'APROVADA_RESSALVA':
            case 'REPROVADA':
                return true;
            default:
                return false;
            }
        }
        return false;
    }

    useEffect(()=>{
        verificaRetificacao()
    }, [verificaRetificacao])

    return (
        <>
            {Object.entries(prestacaoDeContas).length > 0 &&
            <>
                <div className="d-flex bd-highlight mt-3 mb-0 container-cabecalho">
                    <div className="flex-grow-1 bd-highlight">
                        <p className='titulo-explicativo mb-0'>{prestacaoDeContas.associacao.nome}</p>
                        {periodoTexto &&
                            <p className='fonte-16'><strong>Período: {periodoTexto}</strong></p>
                        }
                        {publicacaoTexto &&
                            <p className='fonte-16'><strong>{publicacaoTexto}</strong></p>
                        }
                        {retificacaoTexto &&
                            <p className='fonte-16'><strong>{retificacaoTexto}</strong></p>
                        }
                    </div>
                    <div className="p-2 bd-highlight">
                        <Link
                            to={`/dre-lista-prestacao-de-contas/${prestacaoDeContas.periodo_uuid}/${prestacaoDeContas.status}`}
                            className="btn btn-outline-success btn-ir-para-listagem ml-2"
                        >
                            <FontAwesomeIcon
                                style={{marginRight: "5px", color: '#00585E'}}
                                icon={faArrowLeft}
                            />
                            Ir para a listagem
                        </Link>
                    </div>
                    {exibeSalvar &&
                        <div className="p-2 bd-highlight">
                            <button
                                onClick={metodoSalvarAnalise}
                                className="btn btn-success"
                                disabled={btnSalvarDisabled}
                            >
                                Salvar
                            </button>
                        </div>
                    }

                </div>
                <div className="row">
                    <div className='col-12 col-md-6'>
                        <p><strong>Código Eol: </strong>{prestacaoDeContas.associacao.unidade.codigo_eol}</p>
                    </div>
                    <div className='col-12 col-md-6'>
                        <p><strong>Presidente da APM: </strong> {prestacaoDeContas.associacao.presidente_associacao.nome}</p>
                    </div>
                    <div className='col-12 col-md-6'>
                        <p><strong>Número do CNPJ: </strong> {prestacaoDeContas.associacao.cnpj}</p>
                    </div>
                    <div className='col-12 col-md-6'>
                        <p><strong>Presidente do Conselho Fiscal: </strong> {prestacaoDeContas.associacao.presidente_conselho_fiscal.nome}</p>
                    </div>

                    {verificaStatusPc() && prestacaoDeContas?.em_retificacao && visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE' ? <div className="tag-justificativa"
                        style={{ backgroundColor: '#D06D12', marginLeft: '15px' }}
                    >
                        Em retificação
                    </div> : null
                    }
                    <div className='col-12'>
                        <hr className='mt-2 mb-2'/>
                    </div>
                </div>
            </>
            }
        </>
    );
}
export default memo(Cabecalho)