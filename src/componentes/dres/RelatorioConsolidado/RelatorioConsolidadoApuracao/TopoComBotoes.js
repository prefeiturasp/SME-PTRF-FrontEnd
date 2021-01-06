import React from "react";
import {visoesService} from "../../../../services/visoes.service";

export const TopoComBotoes = ({periodoNome, contaNome, onClickGerarRelatorio}) =>{
    return(
        <>
            <div className="d-flex bd-highlight mb-3">
                <div className="py-2 flex-grow-1 bd-highlight"><h4 className='pl-0'>Período {periodoNome} | Conta {contaNome}</h4></div>
                <div className="py-2 bd-highlight">
                    <button onClick={()=>window.location.assign('/dre-relatorio-consolidado')} className="btn btn-outline-success">Cancelar</button>
                </div>
                {visoesService.getPermissoes(['gerar_relatorio_consolidado_dre'])
                ? 
                    <div className="py-2 bd-highlight">
                        <button onClick={onClickGerarRelatorio} className="btn btn-success ml-2">Gerar relatório</button>
                    </div>
                : null}
            </div>
        </>
    )
};