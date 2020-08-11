import React, {useEffect, useState} from "react";
import {getAssociacao} from "../../../../services/dres/Associacoes.service";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {Formik} from "formik";
import {salvaDadosDiretoria} from "../../../../services/dres/Unidades.service";

export const DadosDaDiretoria = () => {
    const [dadosDiretoria, setDadosDiretoria] = useState(null);
    const [stateFormDiretoria, setStateFormDiretoria] = useState({
        dre_cnpj: "",
        dre_diretor_regional_rf: "",
        dre_diretor_regional_nome: "",
        dre_designacao_portaria: "",
        dre_designacao_ano: "",
    });

    useEffect(() => {
        buscaDiretoria()
    }, []);

    const buscaDiretoria = async () => {
        let diretoria = await getAssociacao(localStorage.getItem(ASSOCIACAO_UUID));
        console.log("Diretoria ", diretoria.unidade.dre.nome)
        setDadosDiretoria(diretoria.unidade)
        setStateFormDiretoria({
            dre_cnpj: diretoria.unidade.dre_cnpj,
            dre_diretor_regional_rf: diretoria.unidade.dre_diretor_regional_rf,
            dre_diretor_regional_nome: diretoria.unidade.dre_diretor_regional_nome,
            dre_designacao_portaria: diretoria.unidade.dre_designacao_portaria,
            dre_designacao_ano: diretoria.unidade.dre_designacao_ano,
        })
    };

    const handleSubmit = async (values) => {

        console.log("handleSubmit ", values)

        const payload = {
            "dre_cnpj": values.dre_cnpj,
            "dre_diretor_regional_rf": values.dre_diretor_regional_rf,
            "dre_diretor_regional_nome": values.dre_diretor_regional_nome,
            "dre_designacao_portaria": values.dre_designacao_portaria,
            "dre_designacao_ano": values.dre_designacao_ano,
        };

        try {
            const response = await salvaDadosDiretoria(dadosDiretoria.uuid, payload);
            console.log("SALVA ", response)
            if (response.status === 200) {
                console.log("Operação realizada com sucesso!");
                await buscaDiretoria();
            } else {
                console.log(response);
                return
            }
        } catch (error) {
            console.log(error);
            return
        }

    };

    return (
        <>
            {dadosDiretoria ? (
                <>
                    <div className="d-flex bd-highlight">
                        <div className="p-2 flex-grow-1 bd-highlight">
                            <h1 className="titulo-itens-painel mt-5">Dados da diretoria {dadosDiretoria.dre.nome}</h1>
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
                                    validateOnBlur={true}
                                    //validationSchema={YupSignupSchemaDadosDaAssociacao}
                                    enableReinitialize={true}
                                    onSubmit={handleSubmit}
                                >
                                    {props => (
                                        <form onSubmit={props.handleSubmit}>
                                            <div className="form-row">
                                                <div className="form-group col-12">
                                                    <label htmlFor="dre_cnpj">Número do CNPJ</label>
                                                    <input
                                                        type="text"
                                                        value={props.values.dre_cnpj}
                                                        name="dre_cnpj"
                                                        id="dre_cnpj"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                    />
                                                    {props.touched.dre_cnpj && props.errors.dre_cnpj && <span className="span_erro text-danger mt-1"> {props.errors.dre_cnpj} </span>}
                                                </div>
                                                <div className="form-group col-md-6 mt-3">
                                                    <label htmlFor="dre_diretor_regional_rf">Registro funcional do Diretor Regional</label>
                                                    <input
                                                        type="text"
                                                        value={props.values.dre_diretor_regional_rf}
                                                        name="dre_diretor_regional_rf"
                                                        id="dre_diretor_regional_rf"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                    />
                                                    {props.touched.dre_diretor_regional_rf && props.errors.dre_diretor_regional_rf && <span className="span_erro text-danger mt-1"> {props.errors.dre_diretor_regional_rf} </span>}
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
                                                    {props.touched.dre_diretor_regional_nome && props.errors.dre_diretor_regional_nome && <span className="span_erro text-danger mt-1"> {props.errors.dre_diretor_regional_nome} </span>}
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
                                                    />
                                                    {props.touched.dre_designacao_portaria && props.errors.dre_designacao_portaria && <span className="span_erro text-danger mt-1"> {props.errors.dre_designacao_portaria} </span>}
                                                </div>

                                                <div className="form-group col-md-6 mt-3">
                                                    <label htmlFor="dre_designacao_ano">Designação Ano</label>
                                                    <input
                                                        type="text"
                                                        value={props.values.dre_designacao_ano}
                                                        name="dre_designacao_ano"
                                                        id="dre_designacao_ano"
                                                        className="form-control"
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                    />
                                                    {props.touched.dre_designacao_ano && props.errors.dre_designacao_ano && <span className="span_erro text-danger mt-1"> {props.errors.dre_designacao_ano} </span>}
                                                </div>

                                            </div>

                                            <div className="d-flex  justify-content-end pb-3">
                                                <button onClick={props.handleReset} type="reset" className="btn btn btn-outline-success mt-2">Cancelar</button>
                                                <button type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                                            </div>

                                        </form>
                                    )}
                                </Formik>

                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}