import React from "react";
import {Formik} from "formik";

export const Filtros = ({tabelaAssociacoes, handleSubmitFiltros, handleLimparFiltros, initialValuesFiltros}) => {
    return(
        
            <Formik
                initialValues={initialValuesFiltros}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={handleSubmitFiltros}
            >
                {props => {
                    const {
                        values,
                        setFieldValue
                    } = props;
                    return(
                        <form method="POST" onSubmit={props.handleSubmit}>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <p className="titulo-filtros-retificacao">Unidades</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="filtro_por_nome">Pesquisar por nome</label>
                                    <input
                                        value={values.filtro_por_nome}
                                        onChange={(e) => props.handleChange(e)}
                                        name="filtro_por_nome"
                                        type="text"
                                        className="form-control"
                                        placeholder="Nome da unidade"
                                    />
                                </div>

                                <div className="col-6">
                                    <label htmlFor="filtro_por_tipo">Pesquisar por tipo unidade</label>
                                    <select
                                        value={values.filtro_por_tipo}
                                        onChange={(e) => props.handleChange(e)}
                                        name="filtro_por_tipo"
                                        id="filtro_por_tipo"
                                        className="form-control"
                                    >
                                        <option value="">Selecione um tipo</option>
                                        {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.filter(element=> element.id !== 'ADM' && element.id !== 'DRE' && element.id !== 'IFSP' && element.id !== 'CMCT').map(item => (
                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end pb-4 mt-3">
                                <button onClick={(e) => {handleLimparFiltros(setFieldValue)}} className="btn btn-outline-success" type="button">Limpar</button>
                                <button className="btn btn-outline-success btn-ir-para-listagem ml-2">Filtrar</button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
    )
}