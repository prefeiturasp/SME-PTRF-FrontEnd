import React, {useState, useEffect } from "react";
import {FieldArray, Formik} from "formik";
import { DatePickerField } from "../../../../../../Globais/DatePickerField";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { consultarRF } from "../../../../../../../services/escolas/Associacao.service";
import {visoesService} from "../../../../../../../services/visoes.service"
import {apenasNumero} from "../../../../../../../utils/ValidacoesAdicionaisFormularios";


export const FormularioEditaAta = ({listaPresentesPadrao, listaPresentes, stateFormEditarAta, uuid_ata, formRef, onSubmitFormEdicaoAta, setDisableBtnSalvar}) => {
    const podeEditarAta = [['change_ata_parecer_tecnico']].some(visoesService.getPermissoes)
    const [dadosForm, setDadosForm] = useState({});
    const [disableBtnAdicionarPresente, setDisableBtnAdicionarPresente] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        getDados();
    }, [stateFormEditarAta, listaPresentes, listaPresentesPadrao]);

    const getDados = () => {

        let obj = {
            listaPresentes: listaPresentes.length === 0 ? listaPresentesPadrao : listaPresentes,
            stateFormEditarAta: stateFormEditarAta
        }
        setDadosForm(obj)
    };

    const handleChangeRf = async (e, setFieldValue, index, listaPresentes) => {
        let erros = {};
        let rf = e.target.value;

        setFieldValue(`listaPresentes[${index}].nome`, "")
        setFieldValue(`listaPresentes[${index}].cargo`, "")
        erros = {
            ...erros,
            [index]: null
        }
        setFormErrors(erros);

        if(rf.length === 7){
            if(rfDuplicado(listaPresentes, rf)){
                erros = {
                    ...erros,
                    [index]: "Esta pessoa já está na lista de presentes"
                }
                setFormErrors(erros);   
            }
            else{
                try{
                
                    let servidor = await consultarRF(rf);
                    if (servidor.status === 200 || servidor.status === 201) {
                        let nome_servidor = servidor.data[0].nm_pessoa
                        let cargo_servidor = servidor.data[0].cargo
        
                        setFieldValue(`listaPresentes[${index}].nome`, nome_servidor)
                        setFieldValue(`listaPresentes[${index}].cargo`, cargo_servidor)
                        setDisableBtnAdicionarPresente(false);
                        setDisableBtnSalvar(false);

                        erros = {
                            ...erros,
                            [index]: null
                        }
                        setFormErrors(erros);
                    }
                }
                catch (e){
                    console.log(e)
                    setFieldValue(`listaPresentes[${index}].nome`, "")
                    setFieldValue(`listaPresentes[${index}].cargo`, "")
                    setDisableBtnAdicionarPresente(true);
                    setDisableBtnSalvar(true);

                    erros = {
                        ...erros,
                        [index]: "Servidor não encontrado"
                    }
                    setFormErrors(erros);
                }
            }    
        }
    };

    const rfVazio = (values) => {
        for(let i=0; i<=values.length-1; i++){
            if(values[i].rf === ""){
                setDisableBtnAdicionarPresente(true);
                setDisableBtnSalvar(true);
                break;
            }
            else{
                setDisableBtnAdicionarPresente(false);
                setDisableBtnSalvar(false);
            }
        }
    }

    const rfDuplicado = (listaPresentes, rf) => {
        let result = listaPresentes.find( presente => presente.rf === rf )
        if(result){
            return true;
        }

        return false;
    }

    const onHandleChangeNumeroPortaria = (e, setFieldValue) => {
        let valor = e.target.value;

        if(apenasNumero(valor)){
           setFieldValue('stateFormEditarAta.numero_portaria', valor)
        }
    }

    const onHandleChangeNumeroAta = (e, setFieldValue) => {
        let valor = e.target.value;

        if(apenasNumero(valor)){
           setFieldValue('stateFormEditarAta.numero_ata', valor)
        }
    }

    const onHandleChangeNumeroRf = (e, setFieldValue, index) => {
        let valor = e.target.value;

        if(apenasNumero(valor)){
            setFieldValue(`listaPresentes[${index}].rf`, valor);
        }
    }

    return (
        
        <div className="div-form-edicao-ata-parecer-tecnico">
            {dadosForm && dadosForm.stateFormEditarAta
            ?
                <Formik
                    initialValues={dadosForm}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    validateOnChange={true}
                    innerRef={formRef}
                    onSubmit={onSubmitFormEdicaoAta}
                >
                    {props => {
                        const {
                            values,
                            errors,
                            setFieldValue
                        } = props;
                        return(
                            <>
                                <form>
                                    <hr className="mt-2"/>

                                    <div className="form-row mt-4">
                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.numero_ata">Número da Ata</label>
                                            <input
                                                value={values.stateFormEditarAta.numero_ata ? values.stateFormEditarAta.numero_ata : ''}
                                                onChange={(e) => {
                                                    onHandleChangeNumeroAta(e, setFieldValue);
                                                }}
                                                name="stateFormEditarAta.numero_ata"
                                                id="stateFormEditarAta.numero_ata"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                                type="text"
                                            />
                                        </div>

                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.data_reuniao">Data da reunião</label>
                                            <DatePickerField
                                                name="stateFormEditarAta.data_reuniao"
                                                value={values.stateFormEditarAta.data_reuniao ? values.stateFormEditarAta.data_reuniao : ''}
                                                onChange={setFieldValue}
                                                disabled={!podeEditarAta}
                                            />
                                        </div>

                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.hora_reuniao">Horário</label>
                                            <input
                                                value={values.stateFormEditarAta.hora_reuniao ? values.stateFormEditarAta.hora_reuniao : ''}
                                                onChange={props.handleChange}
                                                name="stateFormEditarAta.hora_reuniao"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                                type="time"
                                            />
                                        </div>

                                    </div>

                                    <div className="form-row mt-2">
                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.numero_portaria">Número da portaria</label>
                                            <input
                                                value={values.stateFormEditarAta.numero_portaria ? values.stateFormEditarAta.numero_portaria : ''}
                                                onChange={(e) => {
                                                    onHandleChangeNumeroPortaria(e, setFieldValue);
                                                }}
                                                name="stateFormEditarAta.numero_portaria"
                                                id="stateFormEditarAta.numero_portaria"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                                type="text"
                                            />
                                        </div>

                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.data_portaria">Data da portaria</label>
                                            <DatePickerField
                                                name="stateFormEditarAta.data_portaria"
                                                value={values.stateFormEditarAta.data_portaria ? values.stateFormEditarAta.data_portaria : ''}
                                                onChange={setFieldValue}
                                                disabled={!podeEditarAta}
                                            />
                                        </div>

                                        <div className="col">
                                            <label htmlFor="stateFormEditarAta.local_reuniao">Local da reunião</label>
                                            <input
                                                value={values.stateFormEditarAta.local_reuniao ? values.stateFormEditarAta.local_reuniao : ''}
                                                onChange={props.handleChange}
                                                name="stateFormEditarAta.local_reuniao"
                                                className="form-control"
                                                disabled={!podeEditarAta}
                                            />
                                        </div>
                                    </div>

                                    <p className="titulo-edicao-ata-presentes mt-4"><strong>Presentes</strong></p>
                                    <FieldArray
                                        name="listaPresentes"
                                        render={({remove, push}) => (
                                            <>
                                                {values.listaPresentes &&  values.listaPresentes.length > 0 && values.listaPresentes.map((presente, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className="form-row">
                                                                <div className="col">
                                                                    <label htmlFor={`listaPresentes.rf_[${index}]`} className="mt-3">RF</label>
                                                                    <input
                                                                        name={`listaPresentes[${index}].rf`}
                                                                        id={`listaPresentes.rf_[${index}]`}
                                                                        className="form-control"
                                                                        value={presente.rf ? presente.rf : ''}
                                                                        onChange={(e) => {
                                                                            onHandleChangeNumeroRf(e, setFieldValue, index);
                                                                            handleChangeRf(e, setFieldValue, index, values.listaPresentes)
                                                                        }}
                                                                        disabled={!presente.editavel}
                                                                    />
                                                                    <p className='mt-1 mb-0'><span className="text-danger">{formErrors && formErrors[index] ? formErrors[index] : null}</span></p>
                                                                </div>

                                                                <div className="col-4">
                                                                    <label htmlFor={`listaPresentes.nome_[${index}]`} className="mt-3">Nome</label>
                                                                    <input
                                                                        name={`listaPresentes[${index}].nome`}
                                                                        id={`listaPresentes.nome_[${index}]`}
                                                                        className="form-control"
                                                                        value={presente.nome ? presente.nome : ''}
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                        }}
                                                                        disabled={true}
                                                                    />
                                                                </div>

                                                                <div className="col-4">
                                                                    <label htmlFor={`listaPresentes.cargo_[${index}]`} className="mt-3">Cargo</label>
                                                                    <input
                                                                        name={`listaPresentes[${index}].cargo`}
                                                                        id={`listaPresentes.cargo_[${index}]`}
                                                                        className="form-control"
                                                                        value={presente.cargo ? presente.cargo : ""}
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                        }}
                                                                        disabled={true}
                                                                    />
                                                                </div>

                                                                <div className="col">
                                                                    <button
                                                                        id={`listaPresentes.btn_[${index}]`}
                                                                        type="button"
                                                                        className="btn btn-remover-presente mt-5"
                                                                        onClick={() => {
                                                                            remove(index);
                                                                            setDisableBtnAdicionarPresente(false);
                                                                            setDisableBtnSalvar(false);
                                                                        }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            style={{
                                                                                fontSize: '17px',
                                                                                marginRight: "4px",
                                                                                color: "#B40C02"
                                                                            }}
                                                                            icon={faTimesCircle}
                                                                        />
                                                                        Remover
                                                                    </button>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                    <button
                                                        disabled={disableBtnAdicionarPresente || rfVazio(values.listaPresentes) || !podeEditarAta}
                                                        type="button"
                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                        onClick={() => {
                                                            setDisableBtnSalvar(true);
                                                            setDisableBtnAdicionarPresente(true);
                                                            push({
                                                                ata: uuid_ata,
                                                                rf: '',
                                                                nome: '',
                                                                cargo: '',
                                                                editavel: true,
                                                            });
                                                        }}
                                                    >
                                                        + Adicionar presente
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    >

                                    </FieldArray>

                                    <p className="titulo-comentarios mt-5">Comentários <span className="titulo-comentarios-opcional">(opcional)</span></p>
                                    <div className="form-row">
                                        <div className="col-12">
                                            <label htmlFor="stateFormEditarAta.comentarios" className="mb-0">Utilize esse campo para registrar possíveis dúvidas, discussões, esclarecimentos aparecidos durante a reunião</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Escreva seu texto aqui"
                                                value={values.stateFormEditarAta.comentarios ? values.stateFormEditarAta.comentarios : ''}
                                                onChange={props.handleChange}
                                                name="stateFormEditarAta.comentarios"
                                                className="form-control mt-2"
                                                disabled={!podeEditarAta}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </>
                        )
                    }}

                </Formik>
            :
                null
            }
        </div>
    )
}