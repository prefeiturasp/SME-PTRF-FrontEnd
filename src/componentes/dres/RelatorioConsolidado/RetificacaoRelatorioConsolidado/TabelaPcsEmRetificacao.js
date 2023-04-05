import React from "react";
import { MsgImgCentralizada } from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export const TabelaPcsEmRetificacao = ({pcsEmRetificacao, rowsPerPage, nomeComTipoTemplateRetificacao, selecionarHeader, selecionarTemplatePcsEmRetificacao, quantidadeSelecionadaEmRetificacao, montagemDesfazerRetificacao, mensagemQuantidadeExibida, rowClassNamePcsEmRetificacao}) => {
    return(
        <>
            {quantidadeSelecionadaEmRetificacao > 0 
                ?
                    (montagemDesfazerRetificacao())
                :
                    (mensagemQuantidadeExibida(true)) // Rever no teste
            }

            <div className="row">
                <div className="col-12">
                    {pcsEmRetificacao && pcsEmRetificacao.length > 0
                        ?
                            <DataTable
                                value={pcsEmRetificacao}
                                paginator={pcsEmRetificacao.length > rowsPerPage}
                                rows={rowsPerPage}
                                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                autoLayout={true}
                                rowClassName={rowClassNamePcsEmRetificacao}
                                stripedRows
                                id="tabela-em-retificacao"
                            >
                                <Column header={selecionarHeader(true)} body={selecionarTemplatePcsEmRetificacao} style={{width: '4%', borderRight: 'none'}}/>
                                <Column body={nomeComTipoTemplateRetificacao} header='Nome da Unidade'/>
                                
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