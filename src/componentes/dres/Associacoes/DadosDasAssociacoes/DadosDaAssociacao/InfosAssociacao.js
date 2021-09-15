import React from "react";

export const InfosAssociacao = ({dadosDaAssociacao}) =>{
    return(
        <>
            <div className="row">
                <div className="d-flex bd-highlight">
                    <div className="flex-grow-1 bd-highlight">
                        <p className="mb-1 ml-2 titulo-explicativo-dre-detalhes">Dados da associação</p>
                    </div>
                
                </div>
            </div>

            <div className="row">
                <div className="col-12 mt-3">
                    <p className="mb-1"><strong>Nome da associação</strong></p>
                    <p>{dadosDaAssociacao.dados_da_associacao.nome}</p>
                </div>
                <div className="col-12 col-md-6 mt-3">
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
                    <p>{dadosDaAssociacao.dados_da_associacao.presidente_associacao.cargo_educacao}</p>
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
                    <p>{dadosDaAssociacao.dados_da_associacao.presidente_conselho_fiscal.cargo_educacao}</p>
                </div>
                <div className="col-12 mt-3">
                    <p className="mb-1"><strong>E-mail do presidente do conselho fiscal</strong></p>
                    <p>{dadosDaAssociacao.dados_da_associacao.presidente_conselho_fiscal.email}</p>
                </div>
            </div>
        </>
    );
};
