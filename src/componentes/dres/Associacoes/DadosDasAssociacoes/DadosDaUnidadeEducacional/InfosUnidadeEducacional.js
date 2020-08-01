import React from "react";

export const InfosUnidadeEducacional = ({dadosDaAssociacao}) =>{
    console.log("InfosUnidadeEducacional ", dadosDaAssociacao);
    const getEnderecoCompleto = () =>{
        let endereco;
        endereco = dadosDaAssociacao.unidade.tipo_logradouro + " ";
        endereco += dadosDaAssociacao.unidade.logradouro ? dadosDaAssociacao.unidade.logradouro + ", " : "";
        endereco += dadosDaAssociacao.unidade.numero ? dadosDaAssociacao.unidade.numero + " - " : "";
        endereco += dadosDaAssociacao.unidade.complemento ? dadosDaAssociacao.unidade.complemento + " - " : "";
        endereco += dadosDaAssociacao.unidade.bairro ? dadosDaAssociacao.unidade.bairro + ", " : "";
        endereco += " São Paulo - SP, ";
        endereco += dadosDaAssociacao.unidade.cep ? dadosDaAssociacao.unidade.cep : "";
        return endereco

    };
    return(
        <div className="row">
            <div className="col-12 col-md-6">
                <p className="mb-1"><strong>Nome da Unidade Educacional</strong></p>
                <p>{dadosDaAssociacao.unidade.nome}</p>
            </div>
            <div className="col-12 col-md-6">
                <p className="mb-1"><strong>Código EOL da Unidade Escolar</strong></p>
                <p>{dadosDaAssociacao.unidade.codigo_eol}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>E-mail da Unidade Escolar</strong></p>
                <p>{dadosDaAssociacao.unidade.email}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>Número de estudantes</strong></p>
                <p>{dadosDaAssociacao.unidade.qtd_alunos}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>Nome do Diretor</strong></p>
                <p>{dadosDaAssociacao.unidade.diretor_nome}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
                <p className="mb-1"><strong>Telefone da Unidade Educacional</strong></p>
                <p>{dadosDaAssociacao.unidade.telefone}</p>
            </div>
            <div className="col-12 mt-3">
                <p className="mb-1"><strong>Endereço da Unidade Educacional</strong></p>
                <p>{getEnderecoCompleto()}</p>
            </div>
        </div>
    );
};
