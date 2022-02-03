import React from "react";
import { visoesService } from "../../../../../../services/visoes.service";

export const TopoComBotoes = ({dadosAta, retornaDadosAtaFormatado, handleClickFecharAtaParecerTecnico, handleClickEditarAta, handleClickGerarAta, textoBtnGerar, downloadAtaParecerTecnico}) =>{
    const podeEditarAta = [['change_ata_parecer_tecnico']].some(visoesService.getPermissoes)

    return(
        <>
        <div className="row">
            <div className='col-12 col-md-5 mt-2 align-self-center'>
                <p className='titulo-visualizacao-da-ata-parecer-tecnico mb-0'>Visualização da ata</p>
                <span className="subtitulo-visualizacao-da-ata-parecer-tecnico">
                    Período {dadosAta.periodo.referencia} - 
                    {retornaDadosAtaFormatado('periodo.data_inicio_realizacao_despesas')} até {retornaDadosAtaFormatado('periodo.data_fim_realizacao_despesas')}
                </span>
            </div>

            <div className='col-12 col-md-7 align-self-center text-right'>
                <button onClick={handleClickEditarAta} type="button" disabled={!podeEditarAta || textoBtnGerar() === 'Ata sendo gerada...'} className="btn btn-success mr-2 mt-2"><strong>Editar ata</strong></button>
                
                {dadosAta && dadosAta.alterado_em &&
                    <button 
                        onClick={handleClickGerarAta} 
                        type="button" 
                        disabled={textoBtnGerar() === 'Ata sendo gerada...'} 
                        className="btn btn-outline-success mr-2 mt-2"
                    >
                        <strong>{textoBtnGerar()}</strong>
                    </button>
                }

                {dadosAta && dadosAta.arquivo_pdf && textoBtnGerar() !== 'Ata sendo gerada...' &&
                    <button 
                        onClick={downloadAtaParecerTecnico} 
                        type="button" 
                        className="btn btn-outline-success mr-2 mt-2"
                    >
                        <strong>Baixar ata</strong>
                    </button>
                }
                
                <button onClick={handleClickFecharAtaParecerTecnico} type="button" className="btn btn-outline-success mt-2"><strong>Fechar</strong></button>
            </div>
        </div>

        <hr/>
        </>
    )
};