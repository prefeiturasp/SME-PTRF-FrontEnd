import React from "react";
import {Formik} from "formik";
import MaskedInput from 'react-text-mask'
import {YupSignupSchemaCadastroDespesa, cpfMaskContitional} from "../../../utils/ValidacoesAdicionaisFormularios";

export const DespesaForm = () => {

    const initialValues = () => (
        {
            cnpCpf: "",
            razaoSocial: "",
            tipoDocumento: "",
            numreroDocumento: "",
            dataDocumento: "",
            tipoTransacao: "",
            dataTransacao: "",
            valorTotal: "",
            valorRecursoProprio: "",
            valorRecursoAcoes: "",
        }
    )

    const onSubmit = (values) => {
        console.log("Ollyver ", values)
    }

    return (
        <>
            <Formik
                initialValues={initialValues()}
                validationSchema={YupSignupSchemaCadastroDespesa}
                validateOnBlur={true}
                onSubmit={onSubmit}
            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <div className="form-row">
                            <div className="col-12 col-md-6 mt-4">
                                <label htmlFor="cnpCpf">CNPJ ou CPF do fornecedor</label>
                                <MaskedInput
                                    mask={(valor) => cpfMaskContitional(valor)}
                                    value={props.values.cnpCpf}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="cnpCpf" id="cnpCpf" type="text" className="form-control" placeholder="Digite o número do documento"
                                />
                                {props.errors.cnpCpf && <span className="span_erro text-danger mt-1"> {props.errors.cnpCpf}</span>}
                            </div>
                            <div className="col-12 col-md-6  mt-4">
                                <label htmlFor="razaoSocial">Razão social do fornecedor</label>
                                <input
                                    value={props.values.razaoSocial}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="razaoSocial" id="razaoSocial" type="text" className="form-control" placeholder="Digite o nome"/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="tipoDocumento">Tipo de documento</label>
                                <select
                                    value={props.values.tipoDocumento}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name='tipoDocumento' id='tipoDocumento' className="form-control" >
                                    <option value="">Selecione o tipo</option>
                                    <option value="laranja">Laranja</option>
                                    <option value="limao">Limão</option>
                                    <option value="coco">Coco</option>
                                    <option value="manga">Manga</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="numreroDocumento">Número do documento</label>
                                <input
                                    value={props.values.numreroDocumento}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="numreroDocumento" id="numreroDocumento" type="text" className="form-control" placeholder="Digite o número"/>
                            </div>

                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="dataDocumento">Data do documento</label>
                                <input
                                    value={props.values.dataDocumento}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="dataDocumento" id="dataDocumento" type="text" className="form-control" placeholder="Escolha a data"/>
                            </div>

                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="tipoTransacao">Tipo de transação</label>
                                <select
                                    value={props.values.tipoTransacao}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name='tipoTransacao' id='tipoTransacao' className="form-control" >
                                    <option value="">Selecione o tipo</option>
                                    <option value="laranja">Laranja</option>
                                    <option value="limao">Limão</option>
                                    <option value="coco">Coco</option>
                                    <option value="manga">Manga</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="dataTransacao">Data da transação</label>
                                <input
                                    value={props.values.dataTransacao}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="dataTransacao" id="dataTransacao" type="text" className="form-control" placeholder="Escolha a data"/>
                            </div>
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="valorTotal">Valor total</label>
                                <input
                                    value={props.values.valorTotal}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="valorTotal" id="valorTotal" type="text" className="form-control" placeholder="Digite o valor total"/>
                            </div>
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="valorRecursoProprio">Valor do recurso próprio</label>
                                <input
                                    value={props.values.valorRecursoProprio}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="valorRecursoProprio" id="valorRecursoProprio" type="text" className="form-control" placeholder="Digite o valor total"/>
                            </div>
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="valorRecursoAcoes">Valor do recurso das ações</label>
                                <input
                                    value={props.values.valorRecursoAcoes}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    readOnly={true}
                                    name="valorRecursoAcoes" id="valorRecursoAcoes" type="text" className="form-control" placeholder="Digite o valor total"/>
                            </div>

                        </div>
                        <div className="d-flex  justify-content-end">
                            <button type="submit" className="btn btn-success mt-2">Acessar</button>
                        </div>
                    </form>
                )}
            </Formik>
        </>
    );
}