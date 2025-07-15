import React, {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useLocation} from "react-router-dom";
import {getAssociacao, alterarAssociacao, getStatusCadastroAssociacao} from "../../../../services/escolas/Associacao.service";
import {CancelarModalAssociacao} from "../../../../utils/Modais";
import {MenuInterno} from "../../../Globais/MenuInterno";
import Loading from "../../../../utils/Loading";
import {UrlsMenuInterno, retornaMenuAtualizadoPorStatusCadastro} from "../UrlsMenuInterno";
import {Formik} from "formik";
import {YupSignupSchemaDadosDaAssociacao} from "../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from "react-text-mask";
import {ExportaDadosDaAsssociacao} from "../ExportaDadosAssociacao"
import {visoesService} from "../../../../services/visoes.service";
import { setStatusCadastro, resetStatusCadastro } from "../../../../store/reducers/componentes/escolas/Associacao/DadosAssociacao/StatusCadastro/actions";
import {toastCustom} from "../../../Globais/ToastCustom";
import "../associacao.scss"
import { getCCMMask } from "../../../../utils/masks";
import { validarDAC11A } from "../../../../utils/validators";

export const DadosDaAsssociacao = () => {
    
    const parametros = useLocation();
    const formRef = useRef();
    // Redux
    const dispatch = useDispatch(); 
    const statusCadastro = useSelector(state => state.DadosAssociacao);
    
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
    const [loading, setLoading] = useState(true);
    const [menuUrls, setMenuUrls] = useState(UrlsMenuInterno);

    useEffect(() => {
        buscaAssociacao();
        setLoading(false)
    }, []);

    useEffect(() => {
        buscaStatusCadastro();
    }, [stateAssociacao]);

    useEffect(() => {
        atualizaMenu();
    }, [statusCadastro]);

    const buscaAssociacao = async () => {
        const associacao = await getAssociacao();
        setStateAssociacao(associacao)
    };
    
    const buscaStatusCadastro = async () => {
        const responseStatusCadastro = await getStatusCadastroAssociacao();
        if(responseStatusCadastro){
            dispatch(setStatusCadastro(responseStatusCadastro));
        } else {
            dispatch(resetStatusCadastro());
        }
    };
    
    const atualizaMenu = () => {
        let urls = retornaMenuAtualizadoPorStatusCadastro(statusCadastro);
        setMenuUrls(urls);
    };
    
    const validForm = (values) => {
        let erros = {};

        const digits = values.ccm.replace(/\D/g, '');
        if (digits.length === 12 && !validarDAC11A(values.ccm)) {
            erros = {
                ccm: 'CCM inválido. Verifique os 12 dígitos'
            }
            formRef.current.setErrors({...erros});            
        }

        if (!values.nome.trim()){
            erros = {
                nome: 'Nome é obrigatório'
            }
            formRef.current.setErrors({...erros});
        }
        return !Object.keys(erros).length;
    };

    const handleSubmit = async (values) => {
        if(validForm(values)){
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
                    toastCustom.ToastCustomSuccess('Edição salva', 'A edição foi salva com sucesso!')
                } else {
                    console.log(response);
                    return
                }
            } catch (error) {
                console.log(error);
                return
            }
            setLoading(false);
        }
    };
    const onHandleClose = () => {
        setShowModalDadosAssociacaoCancelar(false);
    };

    const onCancelarAssociacaoTrue = async (props) => {
        props.handleReset();
        setShowModalDadosAssociacaoCancelar(false);
    };

    const podeEditarDadosAssociacao = () => {
        if(visoesService.getPermissoes(['change_associacao']) && stateAssociacao && stateAssociacao.data_de_encerramento && stateAssociacao.data_de_encerramento.pode_editar_dados_associacao_encerrada){
            return true;
        }
        return false;
    }

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
                                caminhos_menu_interno={menuUrls}
                            />

                            <ExportaDadosDaAsssociacao/>

                            <div className="d-flex justify-content-end my-2">
                                <span className="font-weight-bold">
                                    * Preenchimento obrigatório
                                </span>
                            </div>

                            <Formik
                                initialValues={stateAssociacao}
                                enableReinitialize={true}
                                onSubmit={handleSubmit}
                                validateOnChange={false}
                                validateOnBlur={false}
                                validationSchema={YupSignupSchemaDadosDaAssociacao}
                                innerRef={formRef}
                            >
                                {props => {
                                    const {
                                        setErrors,
                                        errors,
                                    } = props;


                                    return(
                                        
                                        <form onSubmit={props.handleSubmit}>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="nome"><strong>Nome da Associação *</strong></label>
                                                    <input
                                                        type="text"
                                                        value={props.values.nome}
                                                        name="nome"
                                                        id="nome"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        disabled={!podeEditarDadosAssociacao()}
                                                    />
                                                    {props.touched.nome && props.errors.nome && <span
                                                        className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="codigo_eol"><strong>Código EOL da Unidade Educacional</strong></label>
                                                    <input
                                                        readOnly={true}
                                                        type="text"
                                                        value={props.values.unidade && props.values.unidade.codigo_eol ? props.values.unidade.codigo_eol : ""}
                                                        name="codigo_eol"
                                                        id="codigo_eol"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                    />
                                                    {props.touched.codigo_eol && props.errors.codigo_eol && <span
                                                        className="span_erro text-danger mt-1"> {props.errors.codigo_eol} </span>}
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="dre"><strong>Diretoria Regional de Educação</strong></label>
                                                    <input
                                                        readOnly={true}
                                                        type="text"
                                                        value={props.values.unidade && props.values.unidade.dre && props.values.unidade.dre.nome ? props.values.unidade.dre.nome : ""}
                                                        name="dre"
                                                        id="dre"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                    />
                                                    {props.touched.dre && props.errors.dre.nome && <span className="span_erro text-danger mt-1"> {props.errors.dre} </span>}

                                                </div>

                                                <div className="form-group col-md-6">
                                                    <label htmlFor="cnpj"><strong>Número do CNPJ</strong></label>
                                                    <input
                                                        readOnly={true}
                                                        type="text"
                                                        value={props.values.cnpj ? props.values.cnpj : ""}
                                                        name="cnpj"
                                                        id="cnpj"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                    />
                                                    {props.touched.cnpj && props.errors.cnpj && <span
                                                        className="span_erro text-danger mt-1"> {props.errors.cnpj} </span>}
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="ccm"><strong>Cadastro de Contribuintes Mobiliários
                                                        (CCM)</strong></label>
                                                    <MaskedInput
                                                        mask={(valor) => getCCMMask(valor)}
                                                        type="text"
                                                        value={props.values.ccm ? props.values.ccm : ""}
                                                        name="ccm"
                                                        id="ccm"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        disabled={!podeEditarDadosAssociacao()}
                                                    />
                                                    {props.touched.ccm && props.errors.ccm && <span
                                                        className="span_erro text-danger mt-1"> {props.errors.ccm} </span>}
                                                </div>

                                                <div className="form-group col-md-6">
                                                    <label htmlFor="email"><strong>E-mail da Unidade Educacional</strong></label>
                                                    <input
                                                        readOnly={true}
                                                        type="text"
                                                        value={props.values.unidade ? props.values.unidade.email : ""}
                                                        name="email"
                                                        id="email"
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            { podeEditarDadosAssociacao() &&
                                                <div className="d-flex  justify-content-end pb-3">
                                                    <button onClick={() => setShowModalDadosAssociacaoCancelar(true)}
                                                            type="reset"
                                                            className="btn btn btn-outline-success mt-2">Cancelar
                                                    </button>
                                                    <button
                                                        type="submit" className="btn btn-success mt-2 ml-2">Salvar
                                                    </button>
                                                </div>
                                            }

                                            <section>
                                                <CancelarModalAssociacao show={showModalReceitasCancelar}
                                                                         handleClose={onHandleClose}
                                                                         onCancelarTrue={() => onCancelarAssociacaoTrue(props)}/>
                                            </section>
                                        </form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                ) : null}
        </>
    );
};