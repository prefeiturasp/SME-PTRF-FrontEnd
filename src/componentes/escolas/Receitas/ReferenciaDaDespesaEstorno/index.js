import React, {memo} from "react";
import moment from "moment";

const ReferenciaDaDespesaEstorno = ({uuid, rateioEstorno, despesa}) => {

    const numeroDocumentoStatusTemplate = () => {
        const statusColor =
            despesa && despesa.status === 'COMPLETO'
                ? 'ptrf-despesa-status-ativo'
                : 'ptrf-despesa-status-inativo';
        const statusText =
            despesa && despesa.status === 'COMPLETO'
                ? 'Status: COMPLETO'
                : 'Status: RASCUNHO';
        return (
            <>
                <span>{despesa.numero_documento ? despesa.numero_documento : "-"}</span>
                <br/>
                <span className={statusColor}>{statusText}</span>
            </>
        )
    }

    const especificacaoDataTemplate = () => {
        return (
            <div>
                <span>
                {rateioEstorno.especificacao_material_servico ? rateioEstorno.especificacao_material_servico.descricao : ''}
                </span>
                <br/>
                <span>
                Data: {despesa && despesa.data_documento ? moment(despesa.data_documento).format('DD/MM/YYYY') : ''}
                </span>
            </div>
        )
    }

    const tagRateioTemplate = () => {
        if (despesa && despesa.uuid) {
            let rateio = despesa.rateios.filter(rateio => rateio.uuid === rateioEstorno.uuid)
            return rateio && rateio[0] && rateio[0].tag && rateio[0].tag.nome ? rateio[0].tag.nome : "-"
        } else {
            return "-"
        }
    }

    const valorTotalTemplate = () => {
        if (uuid) {
            return parseFloat(rateioEstorno.valor_rateio) ? parseFloat(rateioEstorno.valor_rateio).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            :
            '';
        } else {
            return parseFloat(rateioEstorno.valor_total) ? parseFloat(rateioEstorno.valor_total).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            :
            '';
        }
    }

    return (
        <>
            {despesa && despesa.uuid &&
                <>
                    <p><strong>Referência da Despesa</strong></p>

                    <table className="table table-bordered">
                        <thead>
                        <tr className='table-secondary'>
                            <th scope="col">Nº do documento</th>
                            <th scope="col">Especif. do material ou serviço</th>
                            <th scope="col">Aplicação</th>
                            <th scope="col">Tipo de ação</th>
                            <th scope="col">Vínculo a atividade</th>
                            <th scope="col">Valor (R$)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className='align-middle'>{numeroDocumentoStatusTemplate()}</td>
                            <td className='align-middle'>{especificacaoDataTemplate()}</td>
                            <td className='align-middle'>{rateioEstorno && rateioEstorno.aplicacao_recurso ? rateioEstorno.aplicacao_recurso : ""}</td>
                            <td className='align-middle'>{rateioEstorno && rateioEstorno.acao_associacao && rateioEstorno.acao_associacao.acao && rateioEstorno.acao_associacao.acao.nome ?  rateioEstorno.acao_associacao.acao.nome : ""}</td>
                            <td className='align-middle'>{tagRateioTemplate()}</td>
                            <td className='align-middle'>{valorTotalTemplate()}</td>
                        </tr>
                        </tbody>
                    </table>
                </>
            }
        </>
    )

}

export default memo(ReferenciaDaDespesaEstorno)