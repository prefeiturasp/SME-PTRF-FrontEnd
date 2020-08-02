import React from "react";

export const InfosAssociacao = ({dadosDaAssociacao}) =>{
    return(
        <div className="row">
            <div className="col-12">
                <p className="mb-1"><strong>Nome da associação</strong></p>
                <p>{dadosDaAssociacao.dados_da_associacao.nome}</p>
            </div>
            <div className="col-12 col-md-6">
                <p className="mb-1"><strong>CNPJ</strong></p>
                <p>{dadosDaAssociacao.dados_da_associacao.cnpj}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>CCM</strong></p>
                <p>{dadosDaAssociacao.dados_da_associacao.ccm}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>Nome do presidente da associação</strong></p>
                <p>{dadosDaAssociacao.dados_da_associacao.presidente_associacao.nome}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>Cargo do presidente da associação</strong></p>
                <p></p>
            </div>
            <div className="col-12 mt-3">
                <p className="mb-1"><strong>E-mail do presidente da associação</strong></p>
                <p>{dadosDaAssociacao.dados_da_associacao.presidente_associacao.email}</p>
            </div>


            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>Nome do presidente do conselho fiscal</strong></p>
                <p>{dadosDaAssociacao.dados_da_associacao.presidente_conselho_fiscal.nome}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>Cargo do presidente do conselho fiscal</strong></p>
                <p></p>
            </div>
            <div className="col-12 mt-3">
                <p className="mb-1"><strong>E-mail do presidente do conselho fiscal</strong></p>
                <p>{dadosDaAssociacao.dados_da_associacao.presidente_conselho_fiscal.email}</p>
            </div>
        </div>
    );
};
