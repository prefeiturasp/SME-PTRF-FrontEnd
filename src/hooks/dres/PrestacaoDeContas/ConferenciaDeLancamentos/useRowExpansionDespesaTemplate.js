import React from "react";
import useValorTemplate from "./useValorTemplate";
import useDataTemplate from "../../../Globais/useDataTemplate";
import useTagRateioTemplate from "./useTagRateioTemplate";
import {useCarregaTabelaDespesa} from "../../../Globais/useCarregaTabelaDespesa";
import useConferidoRateioTemplate from "./useConferidoRateioTemplate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";


const useRowExpansionDespesaTemplate = (prestacaoDeContas) =>{

    const valor_template = useValorTemplate()
    const dataTemplate = useDataTemplate()
    const tagRateioTemplate = useTagRateioTemplate()
    const tabelaDespesa = useCarregaTabelaDespesa(prestacaoDeContas)
    const conferidoRateioTemplate = useConferidoRateioTemplate()

    const retornaToolTipRateio = (rateio) =>{
        if (rateio && rateio.estorno && rateio.estorno.uuid){
            let data_estorno = dataTemplate(null, null, rateio.estorno.data)
            let texto_tooltip = `O estorno do dia ${data_estorno} <br/> esta vinculado a essa despesa.`
            return (
                <span className='font-weight-normal' data-tip={texto_tooltip} data-html={true}>
                    <FontAwesomeIcon
                        style={{fontSize: '18px', marginLeft: "4px", color: '#2A6397'}}
                        icon={faInfoCircle}
                    />
                    <ReactTooltip/>
                </span>
            )
        }
    }

    return (data) => {
        return (
            <div className='col-12 px-4 py-2'>
                <div className='row'>
                    <div className='col border'>
                        <p className='mt-2 mb-0'><strong>CNPJ / CPF</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.cpf_cnpj_fornecedor ? data.documento_mestre.cpf_cnpj_fornecedor : ''}</p>
                    </div>
                    <div className='col border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Tipo de documento</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.tipo_documento && data.documento_mestre.tipo_documento.nome ? data.documento_mestre.tipo_documento.nome : ''}</p>
                    </div>
                    <div className='col border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Forma de pagamento</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.tipo_transacao && data.documento_mestre.tipo_transacao.nome ? data.documento_mestre.tipo_transacao.nome : ''}</p>
                    </div>
                    <div className='col border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Data do pagamento</strong></p>
                        <p className='mb-2'>{data && data.documento_mestre && data.documento_mestre.data_transacao ? dataTemplate(null, null, data.documento_mestre.data_transacao) : ''}</p>
                    </div>
                    <div className='col border-top border-bottom border-right'>
                        <p className='mt-2 mb-0'><strong>Número do documento:</strong></p>
                        <p className='mb-2'>{data.documento_mestre.documento_transacao}</p>
                    </div>
                </div>
                {data.rateios && data.rateios.length > 0 && data.rateios.map((rateio, index) => (
                    <div key={index} className='row border-bottom border-right border-left pb-3'>

                        <div className='col-12 mb-2'>
                            <div className='font-weight-bold mb-2 mt-2 pb-2 titulo-row-expanded-conferencia-de-lancamentos'>Despesa {index + 1}
                                {(retornaToolTipRateio(rateio))}
                            </div>
                        </div>

                        <div className='col-12'>
                            <div className='col-12 border'>
                                <div className='row'>
                                    <div className='col p-2'>
                                        <p className='mb-0 font-weight-bold'>Tipo de despesa:</p>
                                        {rateio.tipo_custeio && rateio.tipo_custeio.nome ? rateio.tipo_custeio.nome : ''}
                                    </div>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Especificação:</p>
                                        {rateio.especificacao_material_servico && rateio.especificacao_material_servico.descricao ? rateio.especificacao_material_servico.descricao : ''}
                                    </div>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Tipo de aplicação</p>
                                        {rateio.aplicacao_recurso ? tabelaDespesa.tipos_aplicacao_recurso.find(element => element.id === rateio.aplicacao_recurso).nome : ''}
                                    </div>

                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Demonstrado</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-12'>
                            <div className='col-12 border-bottom border-right border-left'>
                                <div className='row'>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Tipo de ação:</p>
                                        {rateio.acao_associacao && rateio.acao_associacao.nome ? rateio.acao_associacao.nome : ''}
                                    </div>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Valor</p>
                                        {rateio.valor_rateio ? valor_template(null, null, rateio.valor_rateio) : 0}
                                    </div>
                                    <div className='col border-left p-2'>
                                        <p className='mb-0 font-weight-bold'>Vínculo a atividade</p>
                                        {tagRateioTemplate(rateio)}
                                    </div>
                                    <div
                                        className='col border-left p-2 d-flex justify-content-center align-items-center'>
                                        {conferidoRateioTemplate(rateio)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

}

export default useRowExpansionDespesaTemplate