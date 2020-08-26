import React from 'react'
import './dashboard.scss'
import '../../../paginas/escolas/404/pagina-404.scss'
import {MsgImgLadoDireito} from "../../Globais/Mensagens/MsgImgLadoDireito";
import Img404 from '../../../assets/img/img-404.svg'
import {
    exibeDataPT_BR,
    exibeDateTimePT_BR,
    exibeValorFormatadoPT_BR,
} from '../../../utils/ValidacoesAdicionaisFormularios'

export const DashboardCard = ({acoesAssociacao, statusPeriodoAssociacao}) => {
    let status = statusPeriodoAssociacao;
    return (
        <>
            {acoesAssociacao.info_acoes && acoesAssociacao.info_acoes.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2">
                        {acoesAssociacao.info_acoes.map((acao, index) => (
                            <div key={index} className="col mb-4 container-dashboard-card">
                                <div className="card h-100">
                                    <div className="card-header bg-white">
                                        {acao.acao_associacao_nome &&
                                        <span><strong>{acao.acao_associacao_nome}</strong>{' '}</span>
                                        }
                                    </div>
                                    <div className="card-body">
                                        <div className="row">

                                            <div className="col-12 col-md-7  align-self-center">
                                                <p className="pt-1 mb-4">
                                                    Saldo reprogramado: <strong>{exibeValorFormatadoPT_BR(acao.saldo_reprogramado)}</strong>
                                                </p>
                                                <p className="pt-1 mb-4">
                                                    Repasses no período: <strong>{exibeValorFormatadoPT_BR(acao.repasses_no_periodo)}</strong>
                                                </p>
                                                <p className={`pt-1 mb-4 ${status==="EM_ANDAMENTO" && "texto-com-icone"}`}>
                                                    Outras receitas: <strong>{exibeValorFormatadoPT_BR(acao.outras_receitas_no_periodo)}</strong>
                                                </p>
                                                <p className={`pt-1 mb-0 ${status==="EM_ANDAMENTO" && "texto-com-icone"}`}>
                                                    Despesa declarada: <strong>{exibeValorFormatadoPT_BR(acao.despesas_no_periodo)}</strong>
                                                </p>
                                                {acao.acao_associacao_nome.trim() === 'PTRF' ? (
                                                    <p className="pt-1 pb-1 mb-0 mt-4">
                                                        Próx. repasse a partir de: <strong>{acoesAssociacao.data_prevista_repasse !== 'None' ? exibeDataPT_BR(acoesAssociacao.data_prevista_repasse) : ""}</strong>
                                                    </p>
                                                ) : null}
                                            </div>
                                            <div className="col-12 col-md-5 container-lado-direito d-flex align-items-center">
                                                <p className="texto-saldo">Saldo</p>
                                                <div className="row pt-1 pb-1">
                                                    <div className="col-12">

                                                        <div className='mt-5'></div>
                                                        {acao.saldo_atual_custeio ? (
                                                            <p className="pt-1">
                                                                Custeio: <strong>{exibeValorFormatadoPT_BR(acao.saldo_atual_custeio)}</strong>
                                                            </p>
                                                        ) : null}
                                                        {acao.saldo_atual_capital ? (
                                                            <p className="pt-1">
                                                                Capital: <strong>{exibeValorFormatadoPT_BR(acao.saldo_atual_capital)}</strong>
                                                            </p>
                                                        ) : null}
                                                        {acao.saldo_atual_livre ? (
                                                            <p className="pt-1">
                                                                RLA: <strong>{exibeValorFormatadoPT_BR(acao.saldo_atual_livre)}</strong>
                                                            </p>
                                                        ) : null}
                                                        <p className="pt-0">
                                                            Total: <strong>{exibeValorFormatadoPT_BR(acao.saldo_atual_total)}</strong>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) :
                <MsgImgLadoDireito
                    texto="A sua escola não possui ações ativas nesse período."
                    img={Img404}
                />
            }
            <div className="d-flex justify-content-end pb-3 mt-5">
                <p className="ultima-atualizacao">
                    Última atualização:{' '}
                    {exibeDateTimePT_BR(acoesAssociacao.ultima_atualizacao)}
                </p>
            </div>
        </>
    )
};
