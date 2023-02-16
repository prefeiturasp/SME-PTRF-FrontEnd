import React from "react";
import { MsgImgCentralizada } from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export const TabelaPcsRetificaveis = ({pcsDoConsolidado, rowsPerPage, nomeComTipoTemplate, selecionarHeader, selecionarTemplate, quantidadeSelecionada, montagemRetificar, mensagemQuantidadeExibida, rowClassName}) => {
    return(
        <>
            {quantidadeSelecionada > 0 
                ?
                    (montagemRetificar())
                :
                    (mensagemQuantidadeExibida())
            }

            <div className="row">
                <div className="col-12">
                    {pcsDoConsolidado && pcsDoConsolidado.length > 0
                        ?
                            <DataTable
                                value={pcsDoConsolidado}
                                paginator={pcsDoConsolidado.length > rowsPerPage}
                                rows={rowsPerPage}
                                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                autoLayout={true}
                                rowClassName={rowClassName}
                                stripedRows
                                id="tabela-retificaveis"
                            >
                                <Column header={selecionarHeader()} body={selecionarTemplate} style={{width: '4%', borderRight: 'none'}}/>
                                <Column body={nomeComTipoTemplate} header='Nome da Unidade'/>
                                
                            </DataTable>
                        :
                            <MsgImgCentralizada
                                texto='Não encontramos resultados, verifique os filtros e tente novamente.'
                                img={Img404}
                            />
                    }
                </div>
            </div>
        </>
    )
}