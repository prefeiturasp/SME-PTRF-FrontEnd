import React, {useEffect, useState} from "react";
import {getAssociacao, alterarAssociacao} from "../../../../services/escolas/Associacao.service";
import {CancelarModalAssociacao, SalvarModalAssociacao} from "../../../../utils/Modais";
import {MenuInterno} from "../../../Globais/MenuInterno";
import "../associacao.scss"
import Loading from "../../../../utils/Loading";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {Formik} from "formik";
import {YupSignupSchemaDadosDaAssociacao} from "../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from "react-text-mask";

export const DadosDaAsssociacao = () => {

    const [stateAssociacao, setStateAssociacao] = useState({
        nome: "",
        codigo_eol: "",
        cnpj: "",
        presidente_associacao_nome: "",
        presidente_associacao_rf: "",
        presidente_conselho_fiscal_nome: "",
        presidente_conselho_fiscal_rf: "",
        ccm: "",
        email: "",
    });

    const [showModalReceitasCancelar, setShowModalDadosAssociacaoCancelar] = useState(false);
    const [showModalReceitasSalvar, setShowModalDadosAssociacaoSalvar] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        buscaAssociacao();
        setLoading(false)
    }, []);

    const buscaAssociacao = async () => {
        const associacao = await getAssociacao();
        setStateAssociacao(associacao)
    };

    const handleSubmit = async (values) => {
        setLoading(true);

            const payload = {
                "nome": values.nome,
                "presidente_associacao_nome": values.presidente_associacao_nome,
                "presidente_associacao_rf": "",
                "presidente_conselho_fiscal_nome": values.presidente_conselho_fiscal_nome,
                "presidente_conselho_fiscal_rf": "",
                "ccm": values.ccm,
                "email": values.email,
            };

            try {
                const response = await alterarAssociacao(payload);
                if (response.status === 200) {
                    console.log("Operação realizada com sucesso!");
                    await buscaAssociacao();
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
    const onHandleClose = () => {
        setShowModalDadosAssociacaoCancelar(false);
    };

    const onCancelarAssociacaoTrue = async (props) => {
        props.handleReset();
        setShowModalDadosAssociacaoCancelar(false);
    };

    const onSalvarAssociacaoTrue = async () => {
        await buscaAssociacao();
        setShowModalDadosAssociacaoSalvar(false);
    };

    const onShowModalSalvar = () => {
        setShowModalDadosAssociacaoSalvar(true);
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

                        <Formik
                            initialValues={stateAssociacao}
                            validateOnBlur={true}
                            validationSchema={YupSignupSchemaDadosDaAssociacao}
                            enableReinitialize={true}
                            onSubmit={handleSubmit}
                        >
                            {props => (
                                <form onSubmit={props.handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="nome"><strong>Nome da Associação</strong></label>
                                            <input
                                                type="text"
                                                value={props.values.nome}
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="codigo_eol"><strong>Código EOL da Unidade Escolar</strong></label>
                                            <input
                                                readOnly={true}
                                                type="text"
                                                value={props.values.unidade && props.values.unidade.codigo_eol ? props.values.unidade.codigo_eol :  ""}
                                                name="codigo_eol"
                                                id="codigo_eol"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            {props.touched.codigo_eol && props.errors.codigo_eol && <span className="span_erro text-danger mt-1"> {props.errors.codigo_eol} </span>}
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="dre"><strong>Diretoria Regional de Educação</strong></label>
                                            <input
                                                readOnly={true}
                                                type="text"
                                                value={props.values.unidade && props.values.unidade.dre.nome ? props.values.unidade.dre.nome :  ""}
                                                name="dre"
                                                id="dre"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            {props.touched.dre && props.errors.dre && <span className="span_erro text-danger mt-1"> {props.errors.dre} </span>}

                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="cnpj"><strong>Número do CNPJ</strong></label>
                                            <input
                                                readOnly={true}
                                                type="text"
                                                value={props.values.cnpj  ? props.values.cnpj :  ""}
                                                name="cnpj"
                                                id="cnpj"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            {props.touched.cnpj && props.errors.cnpj && <span className="span_erro text-danger mt-1"> {props.errors.cnpj} </span>}
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="ccm"><strong>Cadastro de Contribuintes Mobiliários (CCM)</strong></label>
                                            <MaskedInput
                                                mask = {[/\d/,'.', /\d/, /\d/,/\d/, '.', /\d/, /\d/, /\d/, '-', /\d/]}
                                                type="text"
                                                value={props.values.ccm  ? props.values.ccm :  ""}
                                                name="ccm"
                                                id="ccm"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            {props.touched.ccm && props.errors.ccm && <span className="span_erro text-danger mt-1"> {props.errors.ccm} </span>}
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="email"><strong>Email da associação</strong></label>
                                            <input
                                                type="text"
                                                value={props.values.email  ? props.values.email :  ""}
                                                name="email"
                                                id="email"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                            />
                                            {props.touched.email && props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email} </span>}
                                        </div>
                                    </div>
                                    <div className="d-flex  justify-content-end pb-3">
                                        <button onClick={()=>setShowModalDadosAssociacaoCancelar(true)} type="reset" className="btn btn btn-outline-success mt-2">Cancelar </button>
                                        <button type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                                    </div>

                                    <section>
                                        <CancelarModalAssociacao show={showModalReceitasCancelar}  handleClose={onHandleClose} onCancelarTrue={()=>onCancelarAssociacaoTrue(props)}/>
                                        <SalvarModalAssociacao show={showModalReceitasSalvar} handleClose={onHandleClose} onCancelarTrue={onSalvarAssociacaoTrue} />
                                    </section>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            ): null}
        </>
    );
};