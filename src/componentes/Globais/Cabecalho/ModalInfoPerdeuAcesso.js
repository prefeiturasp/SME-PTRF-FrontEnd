import React from "react";
import {ModalBootstrapInfoPerdeuAcesso} from "../../Globais/ModalBootstrap";
import { ModalBootstrap } from "../../Globais/ModalBootstrap";

export const ModalInfoPerdeuAcesso = (props) =>{
    let storage = JSON.parse(localStorage.getItem("INFO_PERDEU_ACESSO"));

    const bodyTextarea = () => {
        return(
            <>
                <p>Você não possui mais acesso à(s) seguinte(s) unidade(s):</p>

                {storage && storage.unidades_que_perdeu_acesso && storage.unidades_que_perdeu_acesso.length > 0 && storage.unidades_que_perdeu_acesso.map((unidade, index) => {
                    if(unidade.tipo_unidade === 'SME'){
                        return(
                            <div key={index}>
                                <span key={index}>{unidade.tipo_unidade} {unidade.nome_unidade}</span>
                            </div>
                        ) 
                    }
                    else{
                        return(
                            <div key={index}>
                                <span key={index}>{unidade.cod_eol} - {unidade.tipo_unidade} {unidade.nome_unidade}</span>
                            </div>
                        )
                    }
                })}

                {storage && storage.mensagem &&
                    <p className="mt-3">{storage.mensagem}</p>
                }
                
            </>
        )
    }


    return (
        <ModalBootstrapInfoPerdeuAcesso
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="outline-success"
        />

        
    )
};