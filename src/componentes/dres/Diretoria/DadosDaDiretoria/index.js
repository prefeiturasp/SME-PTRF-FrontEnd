import React, {useEffect, useState} from "react";
import {getUnidade} from "../../../../services/dres/Unidades.service";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {Formik} from "formik";
import MaskedInput from 'react-text-mask'
import {salvaDadosDiretoria} from "../../../../services/dres/Unidades.service";
import {YupSignupSchemaDreDadosDiretoria} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {consultarRF} from "../../../../services/escolas/Associacao.service";
import Loading from "../../../../utils/Loading";
import {CancelarModalDiretoria, SalvarModalDiretoria} from "../../../../utils/Modais";
import {visoesService} from "../../../../services/visoes.service";

export const DadosDaDiretoria = () => {
    const [loading, setLoading] = useState(true);
    const [dadosDiretoria, setDadosDiretoria] = useState(null);
    const [stateFormDiretoria, setStateFormDiretoria] = useState({
        dre_cnpj: "",
        dre_diretor_regional_rf: "",
        dre_diretor_regional_nome: "",
        dre_designacao_portaria: "",
        dre_designacao_ano: "",
    });
    const [showModalDiretoriaSalvar, setShowModalDiretoriaSalvar] = useState(false);
    const [showModalDiretoriaCancelar, setShowModalDiretoriaCancelar] = useState(false);
    useEffect(() => {
        buscaDiretoria()
    }, []);

    const buscaDiretoria = async () => {
        let diretoria = await getUnidade();
        setDadosDiretoria(diretoria);
        setStateFormDiretoria({
            dre_cnpj: diretoria.dre_cnpj,
            dre_diretor_regional_rf: diretoria.dre_diretor_regional_rf,
            dre_diretor_regional_nome: diretoria.dre_diretor_regional_nome,
            dre_designacao_portaria: diretoria.dre_designacao_portaria,
            dre_designacao_ano: diretoria.dre_designacao_ano,
        });
        setLoading(false)
    };

    const handleSubmit = async (values) => {
        const payload = {
            "dre_cnpj": values.dre_cnpj,
            "dre_diretor_regional_rf": values.dre_diretor_regional_rf,
            "dre_diretor_regional_nome": values.dre_diretor_regional_nome,
            "dre_designacao_portaria": values.dre_designacao_portaria,
            "dre_designacao_ano": values.dre_designacao_ano,
        };
        setStateFormDiretoria(payload);
        setLoading(true);

        try {
            await salvaDadosDiretoria(dadosDiretoria.uuid, payload);
            console.log("Operação realizada com sucesso!");
            await buscaDiretoria();
            onShowModalSalvar()

        } catch (error) {
            console.log("Erro ao salvar os dados ", error);
        }
        setLoading(false)
    };

     const validateRf = async (value, setFieldValue, errors) =>{
         if (value){
             try {
                 let rf = await consultarRF(value);
                 if (rf.status === 200 || rf.status === 201) {
                     let nome = rf.data[0].nm_pessoa;
                     delete errors.dre_diretor_regional_rf
                     setFieldValue("dre_diretor_regional_nome", nome)
                 }
             }catch (e) {
                 setFieldValue("dre_diretor_regional_nome", "")
                 errors.dre_diretor_regional_rf = "Digite um RF válido"
             }
         }else {
             delete errors.dre_diretor_regional_rf
         }

    };

    const onHandleClose = () => {
        setShowModalDiretoriaCancelar(false);
    };

    const onCancelarDiretoriaTrue = async (props) => {
        props.handleReset();
        setShowModalDiretoriaCancelar(false);
    };
    const onSalvarDiretoriaTrue = async () => {
        await buscaDiretoria();
        setShowModalDiretoriaSalvar(false);
    };

    const onShowModalSalvar = () => {
        setShowModalDiretoriaSalvar(true);
    };
    return (
        <>
            {loading ? (
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                ) :
                dadosDiretoria ? (
                <>
                    <div className="d-flex bd-highlight">
                        <div className="p-2 flex-grow-1 bd-highlight">
                            <h1 className="titulo-itens-painel mt-5">Dados da diretoria {dadosDiretoria.nome}</h1>
                        </div>
                    </div>
                    <div className="page-content-inner">
                        <div className="row">
                            <div className="col-12">
                                <MenuInterno
                                    caminhos_menu_interno={UrlsMenuInterno}
                                />
                                <Formik
                                    initialValues={stateFormDiretoria}
                                    validateOnBlur={false}
                                    validateOnChange={false}
                                    validationSchema={YupSignupSchemaDreDadosDiretoria}
                                    enableReinitialize={true}
                                    onSubmit={handleSubmit}
                                >
                                    {props => {
                                        const {
                                            setFieldValue,
                                            setErrors,
                                            errors,
                                        } = props;
                                        return(
                                        <form onSubmit={props.handleSubmit}>
                                            <div className="form-row">
                                                <div className="form-group col-12">
                                                    <label htmlFor="dre_cnpj">Número do CNPJ</label>
                                                    <MaskedInput
                                                        mask = {[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/,/\d/]}
                                                        type="text"
                                                        value={props.values.dre_cnpj}
                                                        name="dre_cnpj"
                                                        id="dre_cnpj"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        disabled={!visoesService.getPermissoes(['change_dados_diretoria'])}
                                                        onClick={() => setErrors(
                                                            {
                                                                ...errors,
                                                                dre_cnpj:"",
                                                            }
                                                        )}
                                                    />
                                                    {props.touched.dre_cnpj && props.errors.dre_cnpj && <span className="span_erro text-danger mt-1"> {props.errors.dre_cnpj} </span>}
                                                </div>
                                                <div className="form-group col-md-6 mt-3">
                                                    <label htmlFor="dre_diretor_regional_rf">Registro funcional do Diretor Regional</label>
                                                    <input
                                                        type="text"
                                                        value={props.values.dre_diretor_regional_rf ? props.values.dre_diretor_regional_rf : ""}
                                                        name="dre_diretor_regional_rf"
                                                        id="dre_diretor_regional_rf"
                                                        className="form-control"
                                                        onChange={(e)=>{
                                                            props.handleChange(e);
                                                            validateRf(e.target.value, setFieldValue, errors)
                                                        }}
                                                        disabled={!visoesService.getPermissoes(['change_dados_diretoria'])}
                                                    />
                                                    {props.errors.dre_diretor_regional_rf && <span className="span_erro text-danger mt-1"> {props.errors.dre_diretor_regional_rf} </span>}
                                                </div>
                                                <div className="form-group col-md-6 mt-3">
                                                    <label htmlFor="dre_diretor_regional_nome">Nome do Diretor Regional</label>
                                                    <input
                                                        readOnly={true}
                                                        type="text"
                                                        value={props.values.dre_diretor_regional_nome}
                                                        name="dre_diretor_regional_nome"
                                                        id="dre_diretor_regional_nome"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                    />
                                                </div>
                                                <div className="form-group col-md-6 mt-3">
                                                    <label htmlFor="dre_designacao_portaria">Designação Portaria</label>
                                                    <input
                                                        type="text"
                                                        value={props.values.dre_designacao_portaria}
                                                        name="dre_designacao_portaria"
                                                        id="dre_designacao_portaria"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        disabled={!visoesService.getPermissoes(['change_dados_diretoria'])}
                                                    />
                                                    {props.touched.dre_designacao_portaria && props.errors.dre_designacao_portaria && <span className="span_erro text-danger mt-1"> {props.errors.dre_designacao_portaria} </span>}
                                                </div>
                                                <div className="form-group col-md-6 mt-3">
                                                    <label htmlFor="dre_designacao_ano">Designação Ano</label>
                                                    <MaskedInput
                                                        mask = {[/\d/, /\d/, /\d/, /\d/]}
                                                        type="text"
                                                        value={props.values.dre_designacao_ano}
                                                        name="dre_designacao_ano"
                                                        id="dre_designacao_ano"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        disabled={!visoesService.getPermissoes(['change_dados_diretoria'])}
                                                    />
                                                    {props.touched.dre_designacao_ano && props.errors.dre_designacao_ano && <span className="span_erro text-danger mt-1"> {props.errors.dre_designacao_ano} </span>}
                                                </div>
                                            </div>
                                            <div className="d-flex  justify-content-end pb-3">
                                                <button onClick={props.handleReset} type="reset" className="btn btn btn-outline-success mt-2">Cancelar</button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-success mt-2 ml-2"
                                                    disabled={!visoesService.getPermissoes(['change_dados_diretoria'])}
                                                >
                                                    Salvar
                                                </button>
                                            </div>
                                            <section>
                                                <CancelarModalDiretoria show={showModalDiretoriaCancelar}
                                                                        handleClose={onHandleClose}
                                                                        onCancelarTrue={() => onCancelarDiretoriaTrue(props)}/>
                                                <SalvarModalDiretoria show={showModalDiretoriaSalvar}
                                                                      handleClose={onHandleClose}
                                                                      onCancelarTrue={onSalvarDiretoriaTrue}/>
                                            </section>
                                        </form>
                                        );
                                    }}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
};