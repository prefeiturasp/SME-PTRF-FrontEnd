import React, {useEffect, useState} from "react";
import {getAssociacao, alterarAssociacao} from "../../../services/Associacao.service";
import {CancelarModalAssociacao, SalvarModalAssociacao} from "../../../utils/Modais";
import {MenuInterno} from "../../MenuInterno";
import "../associacao.scss"
import Loading from "../../../utils/Loading";
import {UrlsMenuInterno} from "../UrlsMenuInterno";

export const DadosDaAsssociacao = () => {

    const [stateAssociacao, setStateAssociacao] = useState(undefined);
    const [showModalReceitasCancelar, setShowModalReceitasCancelar] = useState(false);
    const [showModalReceitasSalvar, setShowModalReceitasSalvar] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        buscaAssociacao();
        setLoading(false)
    }, []);

    const buscaAssociacao = async () => {
        const associacao = await getAssociacao();
        console.log("Associacao ", associacao)
        setStateAssociacao(associacao)
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const payload = {
            "nome": stateAssociacao.nome,
            "presidente_associacao_nome": stateAssociacao.presidente_associacao_nome,
            "presidente_associacao_rf": "",
            "presidente_conselho_fiscal_nome": stateAssociacao.presidente_conselho_fiscal_nome,
            "presidente_conselho_fiscal_rf": "",
            "ccm": stateAssociacao.ccm,
            "email": stateAssociacao.email,
        };

        try {
            const response = await alterarAssociacao(payload);
            if (response.status === 200) {
                console.log("Operação realizada com sucesso!");
                onShowModalSalvar()
            } else {
                console.log(response);
                return
            }
        } catch (error) {
            console.log(error);
            return
        }

        setLoading(false)
    };

    const handleChange = (name, value) => {
        setStateAssociacao({
            ...stateAssociacao,
            [name]: value
        });
    };

    const onHandleClose = () => {
        setShowModalReceitasCancelar(false);
    };

    const onCancelarAssociacaoTrue = () => {
        setShowModalReceitasCancelar(false);
        buscaAssociacao();
    };

    const onShowModalCancelar = () => {
        setShowModalReceitasCancelar(true);
    };

    const onSalvarAssociacaoTrue = () => {
        setShowModalReceitasSalvar(false);
    };

    const onShowModalSalvar = () => {
        setShowModalReceitasSalvar(true);
    };

    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                stateAssociacao !== undefined ? (

                <div className="row">
                    <div className="col-12">

                        <MenuInterno
                            caminhos_menu_interno = {UrlsMenuInterno}
                        />

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="nome"><strong>Nome da Associação</strong></label>
                                    <input value={stateAssociacao && stateAssociacao.nome ? stateAssociacao.nome : ""} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="nome" id="nome" type="text" className="form-control" />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="codigo_eol"><strong>Código EOL da Unidade Escolar</strong></label>
                                    <input readOnly={true} value={setStateAssociacao && stateAssociacao.unidade.codigo_eol ? stateAssociacao.unidade.codigo_eol : ""} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="codigo_eol" id="codigo_eol" type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="dre"><strong>Diretoria Regional de Educação</strong></label>
                                    <input readOnly={true} value={stateAssociacao && stateAssociacao.unidade.dre.nome ? stateAssociacao.unidade.dre.nome : "" } onChange={(e)=>handleChange(e.target.name, e.target.value)} name="dre" id="dre" type="text" className="form-control" />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="cnpj"><strong>Número do CNPJ</strong></label>
                                    <input readOnly={true} value={stateAssociacao.cnpj} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="cnpj" id="cnpj" type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="ccm"><strong>CCM</strong></label>
                                    <input value={stateAssociacao && stateAssociacao.ccm ? stateAssociacao.ccm : "" } onChange={(e)=>handleChange(e.target.name, e.target.value)} name="ccm" id="ccm" type="text" className="form-control" />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="email"><strong>Email da associação</strong></label>
                                    <input value={stateAssociacao.email} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="email" id="email" type="text" className="form-control" />
                                </div>
                            </div>

                            {/*<div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="presidente_associacao_nome"><strong>Presidente da Associação</strong></label>
                                    <input value={stateAssociacao.presidente_associacao_nome ? stateAssociacao.presidente_associacao_nome : ""} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="presidente_associacao_nome" id="presidente_associacao_nome" type="text" className="form-control" />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="presidente_conselho_fiscal_nome"><strong>Presidente do Conselho Fiscal</strong></label>
                                    <input value={stateAssociacao.presidente_conselho_fiscal_nome} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="presidente_conselho_fiscal_nome" id="presidente_conselho_fiscal_nome" type="text" className="form-control" />
                                </div>
                            </div>*/}
                            <div className="d-flex  justify-content-end pb-3">
                                <button onClick={onShowModalCancelar} type="reset" className="btn btn btn-outline-success mt-2">Cancelar </button>
                                <button type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            ): null}
            <section>
                <CancelarModalAssociacao show={showModalReceitasCancelar}  handleClose={onHandleClose} onCancelarTrue={onCancelarAssociacaoTrue}/>
                <SalvarModalAssociacao show={showModalReceitasSalvar} handleClose={onHandleClose} onCancelarTrue={onSalvarAssociacaoTrue} />
            </section>
        </>
    );
};