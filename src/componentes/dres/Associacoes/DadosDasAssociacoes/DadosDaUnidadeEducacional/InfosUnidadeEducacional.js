import React from "react";

export const InfosUnidadeEducacional = ({dadosDaAssociacao}) =>{
    const getEnderecoCompleto = () =>{
        let endereco;
        endereco = dadosDaAssociacao.dados_da_associacao.unidade.tipo_logradouro + " ";
        endereco += dadosDaAssociacao.dados_da_associacao.unidade.logradouro ? dadosDaAssociacao.dados_da_associacao.unidade.logradouro + ", " : "";
        endereco += dadosDaAssociacao.dados_da_associacao.unidade.numero ? dadosDaAssociacao.dados_da_associacao.unidade.numero + " - " : "";
        endereco += dadosDaAssociacao.dados_da_associacao.unidade.complemento ? dadosDaAssociacao.dados_da_associacao.unidade.complemento + " - " : "";
        endereco += dadosDaAssociacao.dados_da_associacao.unidade.bairro ? dadosDaAssociacao.dados_da_associacao.unidade.bairro + ", " : "";
        endereco += " São Paulo - SP, ";
        endereco += dadosDaAssociacao.dados_da_associacao.unidade.cep ? dadosDaAssociacao.dados_da_associacao.unidade.cep : "";
        return endereco
    };
    return(
        <>
            <div className="row">
                <div className="d-flex bd-highlight">
                    <div className="flex-grow-1 bd-highlight">
                        <p className="mb-1 ml-2 titulo-explicativo-dre-detalhes">Dados da unidade</p>
                    </div>
                
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-6 mt-3">
                    <p className="mb-1"><strong>Nome da Unidade Educacional</strong></p>
                    <p>{dadosDaAssociacao.dados_da_associacao.unidade.nome}</p>
                </div>
                <div className="col-12 col-md-6 mt-3">
                    <p className="mb-1"><strong>Código EOL da Unidade Escolar</strong></p>
                    <p>{dadosDaAssociacao.dados_da_associacao.unidade.codigo_eol}</p>
                </div>
                <div className="col-12 col-md-6 mt-3">
                    <p className="mb-1"><strong>E-mail da Unidade Escolar</strong></p>
                    <p>{dadosDaAssociacao.dados_da_associacao.unidade.email}</p>
                </div>
                <div className="col-12 col-md-6 mt-3">
                    <p className="mb-1"><strong>Número de estudantes</strong></p>
                    <p>{dadosDaAssociacao.dados_da_associacao.unidade.qtd_alunos}</p>
                </div>
                <div className="col-12 col-md-6 mt-3">
                    <p className="mb-1"><strong>Nome do Diretor</strong></p>
                    <p>{dadosDaAssociacao.dados_da_associacao.unidade.diretor_nome}</p>
                </div>
                <div className="col-12 col-md-6 mt-3">
                    <p className="mb-1"><strong>Telefone da Unidade Educacional</strong></p>
                    <p>{dadosDaAssociacao.dados_da_associacao.unidade.telefone}</p>
                </div>
                <div className="col-12 mt-3">
                    <p className="mb-1"><strong>Endereço da Unidade Educacional</strong></p>
                    <p>{getEnderecoCompleto()}</p>
                </div>
            </div>
        </>
    );
};
