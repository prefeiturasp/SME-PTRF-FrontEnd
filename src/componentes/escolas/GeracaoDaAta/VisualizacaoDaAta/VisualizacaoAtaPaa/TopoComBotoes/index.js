import React from "react";
import { visoesService } from "../../../../../../services/visoes.service";

export const TopoComBotoes = ({dadosAta, handleClickEditarAta, handleClickFecharAta}) => {
    const podeEditarAta = [['change_paa']].some(visoesService.getPermissoes);
    const tituloAta = dadosAta?.tipo_ata === 'RETIFICACAO' 
        ? 'Visualização da Ata de Retificação do PAA' 
        : 'Visualização da Ata de Apresentação do PAA';

    return(
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='titulo-visualizacao-da-ata'>{tituloAta}</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
                {podeEditarAta && (
                    <button type="button" onClick={handleClickEditarAta} className="btn btn-success mr-2 mt-2">
                        <strong>Editar ata</strong>
                    </button>
                )}
                <button type="button" onClick={handleClickFecharAta} className="btn btn-outline-success mr-2 mt-2">
                    <strong>Fechar</strong>
                </button>
            </div>
        </div>
    )
};

