import React, {Fragment} from "react";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";

export const  InfosContas = ({dadosDaAssociacao}) =>{
    return(
        <div className="row">
            {dadosDaAssociacao.dados_da_associacao.contas &&
            dadosDaAssociacao.dados_da_associacao.contas.length > 0 ?
            dadosDaAssociacao.dados_da_associacao.contas.map((conta, index)=>
                <Fragment key={index}>
                    <div className={`col-12 mt-${index === 0 ? "2" : 4} mb-xs-4 mb-md-4 mb-xl-3 ml-0`}>
                        <p className="mb-0">
                            <span className="contador-conta"><strong>Conta {index + 1}</strong></span> <span className="divisor"></span>
                        </p>
                    </div>
                    <div className="col-12 col-md-3">
                        <p><strong>Banco</strong></p>
                        <p>{conta.banco_nome}</p>
                    </div>
                    <div className="col-12 col-md-3">
                        <p><strong>Tipo de conta</strong></p>
                        <p>{conta.tipo_conta.nome}</p>
                    </div>
                    <div className="col-12 col-md-3">
                        <p><strong>Agência</strong></p>
                        <p>{conta.agencia}</p>
                    </div>
                    <div className="col-12 col-md-3">
                        <p><strong>Nº da conta com o dígito</strong></p>
                        <p>{conta.numero_conta}</p>
                    </div>
                </Fragment>
            ):
                <MsgImgCentralizada
                    texto='Não encontramos nenhuma conta, tente novamente'
                    img={Img404}
                />
            }
        </div>
    );
};
