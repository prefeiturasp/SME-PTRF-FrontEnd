import React from "react";
import { IconButton } from "../UI/Button";

export const BotoesTopo = ({setShowModalForm, setStateFormModal, initialStateFormModal, handleClickDownloadModeloArquivoDeCarga, temPermissaoEditarCarga}) =>{
    
    return(
        <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h5 className="font-weight-bold">Carga de Arquivos</h5>
                <p className="m-0">Realize a carga de arquivo conforme o recurso necessário.</p>
            </div>

            <div className="d-flex align-items-end justify-content-end">
                <IconButton
                    icon="faUpload"
                    iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                    label="Adicionar carga"
                    variant="success"
                    onClick={()=>{
                        setStateFormModal(initialStateFormModal);
                        setShowModalForm(true);
                    }}
                    disabled={!temPermissaoEditarCarga()}
                />

                <IconButton
                    icon="faDownload"
                    iconProps={{ style: {fontSize: '15px', marginRight: "5" } }}
                    label="Baixar modelo de planilha"
                    variant="outline-success"
                    onClick={()=> handleClickDownloadModeloArquivoDeCarga()}
                    disabled={!temPermissaoEditarCarga()}
                    className="ml-2"
                />
            </div>
        </div>
    );
};