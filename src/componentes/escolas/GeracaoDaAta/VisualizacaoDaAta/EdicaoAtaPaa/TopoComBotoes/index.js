import React from "react";
import { visoesService } from "../../../../../../services/visoes.service";

export const TopoComBotoes = ({dadosAta, onSubmitFormEdicaoAta, handleClickFecharAta, disableBtnSalvar}) =>{
    const podeEditarAta = [['change_paa']].some(visoesService.getPermissoes);
    const tituloAta = dadosAta?.tipo_ata === 'RETIFICACAO' ? 'Edição da Ata de Retificação do PAA' : 'Edição da Ata de Apresentação do PAA';

    return(
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='titulo-visualizacao-da-ata'>{tituloAta}</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
            <button disabled={disableBtnSalvar || !podeEditarAta} type="button" onClick={onSubmitFormEdicaoAta} className="btn btn-success mr-2 mt-2"> <strong>Salvar</strong></button>
                <button type="button" onClick={handleClickFecharAta} className="btn btn-outline-success mr-2 mt-2"><strong>Voltar</strong></button>
            </div>
        </div>
    )
};
