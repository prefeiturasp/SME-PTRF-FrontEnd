import React, {useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import Loading from "../../../../utils/Loading";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import { visoesService } from "../../../../services/visoes.service";
import { MsgImgLadoDireito } from "../../../Globais/Mensagens/MsgImgLadoDireito";

import Img404 from "../../../../assets/img/img-404.svg";

export const ListaComissoes = ({membrosComissao, loadingMembrosComissao, handleOnShowModalEdicao}) => {
    const rowsPerPage = 10;

    const comissoesTemplate = (rowData) => {
        let comissoes = rowData.comissoes

        return (
            <ul className="marcadores-comissoes">
                {comissoes && comissoes.map((comissao, index) =>
                    <li key={comissao.id}>{comissao.nome}</li>
                )}
                
            </ul>
        )
    }

    const acoesTemplate = (rowData) => {
        return (
            <button
                disabled={!visoesService.getPermissoes(['change_comissoes_dre'])}
                className="btn-editar-membro"
                onClick={() => handleOnShowModalEdicao(rowData)}
            >
                <FontAwesomeIcon
                    style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                    icon={faEdit}
                />
            </button>
        )
    }
    return (
        <>
            {loadingMembrosComissao && membrosComissao.length === 0
                ?
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                :
                    membrosComissao.length > 0 ? (
                        <DataTable
                            value={membrosComissao}
                            paginator={membrosComissao.length > rowsPerPage}
                            rows={rowsPerPage}
                            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        >
                            <Column field='rf' header='RF' className="text-center" style={{width: '8em'}}/>
                            <Column field='nome' header='Nome Completo' className="text-center"/>
                            <Column field='email' header='Email' className="text-center"/>
                            <Column field='' header='Comissão pertencente' body={comissoesTemplate}/>
                            <Column field='' header='Ações' body={acoesTemplate} className="text-center" style={{width: '5em'}}/>
                        </DataTable>
                    )
                    :
                        <MsgImgLadoDireito
                            texto='Não encontramos nenhum membro com comissões'
                            img={Img404}
                        />
                    
            }
        </>
        

        
    )
}