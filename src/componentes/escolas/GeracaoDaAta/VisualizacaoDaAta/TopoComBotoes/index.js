import React from "react";
import {visoesService} from "../../../../../services/visoes.service";

export const TopoComBotoes = ({dadosAta, prestacaoDeContasDetalhe, handleClickEditarAta, handleClickFecharAta, handleClickCopiarAta, setShowModalDevolucoesAoTesouro, exibeBotaoDevolucaoTesouro}) =>{
    const podeEditarAta = [['change_ata_prestacao_contas']].some(visoesService.getPermissoes)
    return(
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>

                {/*Para as atas de apresentação (Não retificação)*/}
                {/*Se não tem Prestação de Conta trata-se de uma prévia*/}
                {dadosAta && dadosAta.tipo_ata !== 'RETIFICACAO' &&
                <p className='titulo-visualizacao-da-ata'>{dadosAta.prestacao_conta ? 'Visualização da ata' : 'Visualização da prévia da ata'}</p>
                }

                {/*Para as atas de retificação*/}
                {/*Se o status da PC é DEVOLVIDA trata-se de uma prévia*/}
                {dadosAta && dadosAta.tipo_ata === 'RETIFICACAO' && prestacaoDeContasDetalhe && prestacaoDeContasDetalhe.status &&
                <p className='titulo-visualizacao-da-ata'>{prestacaoDeContasDetalhe.status !== 'DEVOLVIDA' ? 'Visualização da ata de retificação' : 'Visualização da prévia da ata de retificação'}</p>
                }

            </div>

            <div className='col-12 col-md-7 text-right'>
                { prestacaoDeContasDetalhe && prestacaoDeContasDetalhe.status && (prestacaoDeContasDetalhe.status === 'DEVOLVIDA' || prestacaoDeContasDetalhe.status === 'DEVOLVIDA_RETORNADA') && dadosAta && dadosAta.uuid && dadosAta.tipo_ata === 'RETIFICACAO' ?
                    <>
                        {podeEditarAta && exibeBotaoDevolucaoTesouro &&
                            <button onClick={()=>setShowModalDevolucoesAoTesouro(true)} type="button" className="btn btn-success mr-2 mt-2"> <strong>Devoluções ao Tesouro</strong></button>
                        }

                        <button onClick={handleClickEditarAta} type="button" className="btn btn-success mr-2 mt-2"> <strong>Editar ata de retificação</strong></button>
                    </>
                    : ( dadosAta.tipo_ata !== 'RETIFICACAO' ?
                            <>
                                <button onClick={handleClickEditarAta} type="button" className="btn btn-success mr-2 mt-2"> <strong>Editar ata</strong></button>
                            </>
                        : null
                    )
                }

                {/*Para as atas de apresentação (Não retificação)*/}
                {/*Se não tem Prestação de Conta trata-se de uma prévia e não exibe o selecionar e copiar*/}
                {dadosAta && dadosAta.tipo_ata !== 'RETIFICACAO' && dadosAta.prestacao_conta &&
                <button onClick={handleClickCopiarAta} type="button" className="btn btn-outline-success mr-2 mt-2"><strong>Selecionar e copiar</strong></button>
                }

                {/*Para as atas de retificação*/}
                {/*Se o status da PC é DEVOLVIDA trata-se de uma prévia e não exibe o selecionar e copiar*/}
                {dadosAta && dadosAta.tipo_ata === 'RETIFICACAO' && prestacaoDeContasDetalhe && prestacaoDeContasDetalhe.status && prestacaoDeContasDetalhe.status !== 'DEVOLVIDA' &&
                <button onClick={handleClickCopiarAta} type="button" className="btn btn-outline-success mr-2 mt-2"><strong>Selecionar e copiar</strong></button>
                }

                <button onClick={handleClickFecharAta} type="button" className="btn btn-outline-success mt-2"><strong>Fechar</strong></button>
            </div>
        </div>
    )
};