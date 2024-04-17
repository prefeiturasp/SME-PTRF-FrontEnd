import {Formik} from "formik";

import {ModalBootstrapFormMembros} from "../../../../Globais/ModalBootstrap";
import React from "react";
import * as yup from "yup";
import MaskedInput from "react-text-mask";
import {visoesService} from "../../../../../services/visoes.service";
import {Select} from "antd";

export const YupSignupSchemaProcesso = yup.object().shape({
    numero_processo: yup.string().required("Campo Número do processo é obrigatório"),
    ano: yup.string().required("Campo ano é obrigatório"),
    periodos: yup.string().nullable()
        .test('test-name', 'Campo períodos é obrigatório',
            function (value) {
                if(!visoesService.featureFlagAtiva('periodos-processo-sei')){
                    return true
                }else {
                    return value;
                }
            }),
});

export const ProcessoSeiPrestacaoDeContaForm = ({show, handleClose, onSubmit, handleChange, handleChangeSelectPeriodos, validateForm, initialValues, periodosDisponiveis, customNumeroProcessoError, setCustomNumeroProcessoError}) => {

    const { Option } = Select;

    const anoMask = () => {
        // 0000
        return [/\d/, /\d/, /\d/, /\d/]
    }

    const processoSeiMask = () => {
        // 0000.0000/0000000-0
        return [/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
    }

    const bodyTextarea = () => {
        return (
            <>
                {
                    <Formik
                        initialValues={initialValues}
                        validationSchema={YupSignupSchemaProcesso}
                        validate={validateForm}
                        enableReinitialize={true}
                        validateOnBlur={true}
                        onSubmit={onSubmit}
                    >
                        {props => {
                            const {
                            } = props;
                            return (
                                <form method="POST" id="membrosForm" onSubmit={props.handleSubmit}>

                                    <div className="row">
                                        <div className='col-12'>
                                            <p>* Preenchimento obrigatório</p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="cargo_associacao">Número do processo SEI *</label>
                                                <MaskedInput
                                                    mask={(valor) => processoSeiMask(valor)}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                        setCustomNumeroProcessoError('');
                                                    }
                                                    }
                                                    name="numero_processo"
                                                    className="form-control"
                                                    placeholder="Número do processo SEI"
                                                    value={props.values.numero_processo ? props.values.numero_processo : ""}
                                                />
                                                {props.errors.numero_processo && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.numero_processo}</span>}
                                                {!props.errors.numero_processo && customNumeroProcessoError && <small
                                                    className="span_erro text-danger mt-1"> {`${customNumeroProcessoError}`}</small>}
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="cargo_associacao">Ano *</label>
                                                <MaskedInput
                                                    mask={(valor) => anoMask(valor)}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                        setCustomNumeroProcessoError('');
                                                    }
                                                    }
                                                    name="ano"
                                                    className="form-control"
                                                    placeholder="Ano do processo"
                                                    value={props.values.ano ? props.values.ano : ""}
                                                    disabled={!!initialValues.uuid}
                                                />
                                                {props.errors.ano &&
                                                <span className="span_erro text-danger mt-1"> {props.errors.ano}</span>}
                                            </div>
                                        </div>

                                        {visoesService.featureFlagAtiva('periodos-processo-sei') &&
                                            <>
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label htmlFor="periodos">Períodos *</label>
                                                        <Select
                                                            mode="multiple"
                                                            allowClear
                                                            style={{width: '100%'}}
                                                            placeholder="Períodos"
                                                            name="periodos"
                                                            id="periodos"
                                                            value={props.values.periodos}
                                                            onChange={handleChangeSelectPeriodos}
                                                            className='multiselect-lista-valores-reprogramados'
                                                            disabled={!props.values.ano || props.values.ano.replaceAll("_","").length < 4}
                                                        >
                                                            {periodosDisponiveis && periodosDisponiveis.length > 0 && periodosDisponiveis.map(item => (
                                                                <Option key={item.uuid} value={item.uuid}>{item.referencia}</Option>
                                                            ))}
                                                        </Select>
                                                        {props.errors.periodos && <span className="span_erro text-danger mt-1"> {props.errors.periodos}</span>}
                                                    </div>
                                                </div>
                                            </>
                                        }


                                    </div>
                                    <div className="d-flex  justify-content-end pb-3 mt-3">
                                        <button
                                            onClick={() => handleClose()}
                                            type="button"
                                            className="btn btn btn-outline-success mt-2 mr-2"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            disabled={!visoesService.getPermissoes(['change_processo_sei'])}
                                            type="submit"
                                            className="btn btn-success mt-2"
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                </form>
                            );
                        }}
                    </Formik>
                }
            </>
        )
    };
    return (
        <ModalBootstrapFormMembros
            show={show}
            onHide={handleClose}
            titulo={initialValues.uuid ? "Editar processo" : "Adicionar processo"}
            bodyText={bodyTextarea()}
        />
    )
};
