import React, { Fragment, useState, useEffect } from "react";
import { DatePickerField } from "../../../../../Globais/DatePickerField";
import { visoesService } from "../../../../../../services/visoes.service";
import {FieldArray, Formik} from "formik";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import { getMembroPorIdentificador } from "../../../../../../services/escolas/PresentesAta.service";
import { YupSignupSchemaListaPresentes } from "./YupSignupSchemaEditarAta";
import { valida_cpf_exportado } from "../../../../../../utils/ValidacoesAdicionaisFormularios";




export const FormularioEditaAta = ({
                                        listaPresentesPadrao, 
                                        stateFormEditarAta, 
                                        tabelas,
                                        membrosCargos,
                                        formRef,
                                        onSubmitFormEdicaoAta,
                                        uuid_ata,
                                        listaPresentes,
                                        setDisableBtnSalvar
                                    }) => {

    const podeEditarAta = [['change_ata_prestacao_contas']].some(visoesService.getPermissoes)
    const [dadosForm, setDadosForm] = useState({});
    const [disableBtnAdicionarPresente, setDisableBtnAdicionarPresente] = useState(false)
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        getDados();
    }, [stateFormEditarAta, listaPresentes]);

    const getDados = () => {

        let obj = {
            listaPresentesPadrao: listaPresentes.length === 0 ? listaPresentesPadrao : listaPresentes,
            stateFormEditarAta: stateFormEditarAta
        }

        setDadosForm(obj)
    };


    const handleChangeEditarAtaPresidente = (e, setFieldValue) => {
        let data_objeto = JSON.parse(e.target.options[e.target.selectedIndex].getAttribute('data-objeto'));
        let cargo = data_objeto.cargo_associacao_value
        setFieldValue("stateFormEditarAta.cargo_presidente_reuniao", cargo)
    };

    const handleChangeEditarAtaSecretario = (e, setFieldValue) => {
        let data_objeto = JSON.parse(e.target.options[e.target.selectedIndex].getAttribute('data-objeto'));
        let cargo = data_objeto.cargo_associacao_value
        setFieldValue("stateFormEditarAta.cargo_secretaria_reuniao", cargo)
    };

    const onClickRemoverAdicionar = async (remove, index, editavel, values, setFieldValue) => {
        let erros = {};

        if(editavel){
            let presentes = values.listaPresentesPadrao
            let nome = presentes[index].nome
            let podeCadastrar = true;

            for(let i=0; i<=presentes.length-1; i++){
                if(i !== index){
                    if(nome === presentes[i].nome){
                        podeCadastrar = false;
                        break;
                    }
                }
            }

            if(podeCadastrar){
                setFieldValue(`listaPresentesPadrao[${index}].editavel`, false)
                setDisableBtnAdicionarPresente(false);
                setDisableBtnSalvar(false);
                erros = {
                    ...erros,
                    [index]: null
                }
                setFormErrors(erros);
            }
            else{
                setFieldValue(`listaPresentesPadrao[${index}].editavel`, true)
                setDisableBtnSalvar(true);
                erros = {
                    ...erros,
                    [index]: "Esta pessoa já está na lista de presentes"
                }
                setFormErrors(erros);
            }
        }
        else{
            remove(index)
        }
    }

    const handleChangeIdentificador = async(e, setFieldValue, index) => {
        setFieldValue(`listaPresentesPadrao[${index}].nome`, '')
        setFieldValue(`listaPresentesPadrao[${index}].cargo`, '')

        document.getElementById(`listaPresentesPadrao.nome_[${index}]`).disabled = false;
        document.getElementById(`listaPresentesPadrao.cargo_[${index}]`).disabled = false;
    }

    const isNumber = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const handleBlurIdentificador = async (e, setFieldValue, index) => {
        let identificador = e.target.value

        if(identificador.length === 7 && isNumber(identificador)){
            let membro = await getMembroPorIdentificador(uuid_ata, identificador)

            if(membro.mensagem === "membro-encontrado"){
                setFieldValue(`listaPresentesPadrao[${index}].nome`, membro.nome)
                setFieldValue(`listaPresentesPadrao[${index}].cargo`, membro.cargo)
                setFieldValue(`listaPresentesPadrao[${index}].membro`, true)
            }
            else{
                setFieldValue(`listaPresentesPadrao[${index}].nome`, membro.nome)
                setFieldValue(`listaPresentesPadrao[${index}].cargo`, membro.cargo)
                setFieldValue(`listaPresentesPadrao[${index}].membro`, false)
            }

            document.getElementById(`listaPresentesPadrao.nome_[${index}]`).disabled = true;
            document.getElementById(`listaPresentesPadrao.cargo_[${index}]`).disabled = true;            
        }
        else if(identificador.length === 5 && isNumber(identificador)){
            let membro = await getMembroPorIdentificador(uuid_ata, identificador)

            if(membro.mensagem === "membro-encontrado"){
                setFieldValue(`listaPresentesPadrao[${index}].nome`, membro.nome)
                setFieldValue(`listaPresentesPadrao[${index}].cargo`, membro.cargo)
                setFieldValue(`listaPresentesPadrao[${index}].membro`, true)
            }
            else{
                setFieldValue(`listaPresentesPadrao[${index}].nome`, membro.nome)
                setFieldValue(`listaPresentesPadrao[${index}].cargo`, membro.cargo)
                setFieldValue(`listaPresentesPadrao[${index}].membro`, false)
            }

            document.getElementById(`listaPresentesPadrao.nome_[${index}]`).disabled = true;
            document.getElementById(`listaPresentesPadrao.cargo_[${index}]`).disabled = true; 
        }
        else if(identificador.length === 14 && valida_cpf_exportado(identificador)){
            let membro = await getMembroPorIdentificador(uuid_ata, identificador)
            
            if(membro.mensagem === "membro-encontrado"){
                setFieldValue(`listaPresentesPadrao[${index}].nome`, membro.nome)
                setFieldValue(`listaPresentesPadrao[${index}].cargo`, membro.cargo)
                setFieldValue(`listaPresentesPadrao[${index}].membro`, true)
            }
            else{
                setFieldValue(`listaPresentesPadrao[${index}].nome`, membro.nome)
                setFieldValue(`listaPresentesPadrao[${index}].cargo`, membro.cargo)
                setFieldValue(`listaPresentesPadrao[${index}].membro`, false)
            }

            document.getElementById(`listaPresentesPadrao.nome_[${index}]`).disabled = true;
            document.getElementById(`listaPresentesPadrao.cargo_[${index}]`).disabled = true; 
        }
        else{
            setFieldValue(`listaPresentesPadrao[${index}].nome`, '')
            setFieldValue(`listaPresentesPadrao[${index}].cargo`, '')
            setFieldValue(`listaPresentesPadrao[${index}].membro`, false)

            document.getElementById(`listaPresentesPadrao.nome_[${index}]`).disabled = false;
            document.getElementById(`listaPresentesPadrao.cargo_[${index}]`).disabled = false; 
        }
    };

    
    const nomeCampoIdentificador = (identificador) => {
        if(identificador.length === 7 && isNumber(identificador)){
            return "RF"      
        }
        else if(identificador.length === 5 && isNumber(identificador)){
            return "Código EOL do aluno"
        }
        else if(identificador.length === 14 && valida_cpf_exportado(identificador)){
            return "CPF"
        }
        else{
            return "Identificador (opcional)"
        }
    }

    const nomeCampoCargo = (identificador) => {
        if(identificador.length === 7 && isNumber(identificador)){
            return "Cargo"      
        }
        else if(identificador.length === 5 && isNumber(identificador)){
            return "Cargo"
        }
        else if(identificador.length === 14 && valida_cpf_exportado(identificador)){
            return "Cargo"
        }
        else{
            return "Cargo (opcional)"
        }
    }
    
    return (

        <div>
            {dadosForm && dadosForm.listaPresentesPadrao && dadosForm.listaPresentesPadrao.length > 0 && dadosForm.stateFormEditarAta
                ?
                    <Formik
                        initialValues={dadosForm}
                        enableReinitialize={true}
                        validateOnBlur={true}
                        validateOnChange={true}
                        validationSchema={YupSignupSchemaListaPresentes}
                        onSubmit={onSubmitFormEdicaoAta}
                        innerRef={formRef}
                        
                    >
                        {props => {
                            const {
                                values,
                                errors,
                                setFieldValue
                            } = props;
                            return(
                                <>
                                    <form onSubmit={props.handleSubmit}>
                                        <p className="titulo"><strong>Informações principais</strong></p>
                                        <div className="form-row mt-4">
                                            <div className="col ">
                                                <label htmlFor="stateFormEditarAta.tipo_reuniao">Tipo de Reunião</label>
                                                <select
                                                    value={values.stateFormEditarAta.tipo_reuniao}
                                                    onChange={props.handleChange}
                                                    name="stateFormEditarAta.tipo_reuniao"
                                                    className="form-control"
                                                    disabled={!podeEditarAta}
                                                >
                                                    {tabelas && tabelas.tipos_reuniao && tabelas.tipos_reuniao.map((tipo) =>
                                                        <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div className="col">
                                                <label htmlFor="stateFormEditarAta.data_reuniao">Data</label>
                                                <DatePickerField
                                                    name="stateFormEditarAta.data_reuniao"
                                                    value={values.stateFormEditarAta.data_reuniao}
                                                    onChange={setFieldValue}
                                                    disabled={!podeEditarAta}
                                                />
                                            </div>

                                            <div className="col">
                                                <label htmlFor="stateFormEditarAta.local_reuniao">Local da reunião</label>
                                                <input
                                                    value={values.stateFormEditarAta.local_reuniao}
                                                    onChange={props.handleChange}
                                                    name="stateFormEditarAta.local_reuniao"
                                                    className="form-control"
                                                    disabled={!podeEditarAta}
                                                />
                                            </div>

                                            <div className="col">
                                                <label htmlFor="stateFormEditarAta.convocacao">Abertura da reunião</label>
                                                <select
                                                    value={values.stateFormEditarAta.convocacao}
                                                    onChange={props.handleChange}
                                                    name="stateFormEditarAta.convocacao"
                                                    className="form-control"
                                                    disabled={!podeEditarAta}
                                                >
                                                    {tabelas && tabelas.convocacoes && tabelas.convocacoes.map((tipo) =>
                                                        <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="col">
                                                <label htmlFor="stateFormEditarAta.presidente_reuniao" className="mt-3">Presidente da reunião</label>
                                                <select
                                                    value={values.stateFormEditarAta.presidente_reuniao}
                                                    onChange={(e) => {
                                                        props.handleChange(e)
                                                        handleChangeEditarAtaPresidente(e, setFieldValue)
                                                    }}
                                                    
                                                    name="stateFormEditarAta.presidente_reuniao"
                                                    className="form-control"
                                                    disabled={!podeEditarAta}
                                                >
                                                    {membrosCargos && membrosCargos.length > 0 && membrosCargos.map((membro) =>
                                                        <option data-objeto={JSON.stringify({...membro})} key={membro.nome}
                                                                value={membro.nome}>{membro.nome}</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div className="col">
                                                <label htmlFor="stateFormEditarAta.cargo_presidente_reuniao" className="mt-3">Cargo</label>
                                                <input
                                                    value={values.stateFormEditarAta.cargo_presidente_reuniao}
                                                    onChange={props.handleChange}
                                                    name="stateFormEditarAta.cargo_presidente_reuniao"
                                                    className="form-control"
                                                    disabled={!membrosCargos.find(membro => membro.nome === values.stateFormEditarAta.presidente_reuniao) ? !podeEditarAta : true}
                                                />
                                            </div>

                                            <div className="col">
                                                <label htmlFor="stateFormEditarAta.secretario_reuniao" className="mt-3">Secretário da reunião</label>
                                                <select
                                                    value={values.stateFormEditarAta.secretario_reuniao}
                                                    onChange={(e) => {
                                                        props.handleChange(e)
                                                        handleChangeEditarAtaSecretario(e, setFieldValue)
                                                    }}
                                                    name="stateFormEditarAta.secretario_reuniao"
                                                    className="form-control"
                                                    disabled={!podeEditarAta}
                                                >
                                                    {membrosCargos && membrosCargos.length > 0 && membrosCargos.map((membro) =>
                                                        <option data-objeto={JSON.stringify({...membro})} key={membro.nome} value={membro.nome}>{membro.nome}</option>
                                                    )}
                                                </select>
                                                
                                            </div>

                                            <div className="col">
                                                <label htmlFor="stateFormEditarAta.cargo_secretaria_reuniao" className="mt-3">Cargo</label>
                                                <input
                                                    value={values.stateFormEditarAta.cargo_secretaria_reuniao}
                                                    onChange={props.handleChange}
                                                    name="stateFormEditarAta.cargo_secretaria_reuniao"
                                                    className="form-control"
                                                    disabled={!membrosCargos.find(membro => membro.nome === values.stateFormEditarAta.secretario_reuniao) ? !podeEditarAta : true}
                                                />
                                            </div>
                                        </div>

                                        <p className="titulo mt-4"><strong>Presentes</strong></p>
                                        <FieldArray
                                            name="listaPresentesPadrao"
                                            render={({remove, push}) => (
                                                <>
                                                    {values.listaPresentesPadrao &&  values.listaPresentesPadrao.length > 0 && values.listaPresentesPadrao.map((membro, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className="form-row">
                                                                    <div className="col-3">
                                                                        <label htmlFor={`listaPresentesPadrao.identificacao_[${index}]`} className="mt-3">{nomeCampoIdentificador(membro.identificacao)}</label>
                                                                        <input
                                                                            name={`listaPresentesPadrao[${index}].identificacao`}
                                                                            id={`listaPresentesPadrao.identificacao_[${index}]`}
                                                                            className="form-control"
                                                                            value={membro.identificacao}
                                                                            onChange={(e) => {
                                                                                props.handleChange(e);
                                                                                handleChangeIdentificador(e, setFieldValue, index)
                                                                            }}
                                                                            onBlur={(e) => {
                                                                                handleBlurIdentificador(e, setFieldValue, index)
                                                                            }}
                                                                            disabled={!membro.editavel}
                                                                        />
                                                                    </div>

                                                                    <div className="col-4">
                                                                        <label htmlFor={`listaPresentesPadrao.nome_[${index}]`} className="mt-3">Nome</label>
                                                                        <input
                                                                            name={`listaPresentesPadrao[${index}].nome`}
                                                                            id={`listaPresentesPadrao.nome_[${index}]`}
                                                                            className="form-control"
                                                                            value={membro.nome}
                                                                            onChange={(e) => {
                                                                                props.handleChange(e);
                                                                            }}
                                                                            disabled={!membro.editavel}
                                                                        />
                                                                        <p className='mt-1 mb-0'><span className="text-danger">{errors && errors.listaPresentesPadrao && errors.listaPresentesPadrao[index] && errors.listaPresentesPadrao[index].nome ? errors.listaPresentesPadrao[index].nome : ''}</span></p>
                                                                        <p className='mt-1 mb-0'><span className="text-danger">{formErrors && formErrors[index] ? formErrors[index] : null}</span></p>
                                                                        
                                                                    </div>

                                                                    <div className="col-4">
                                                                        <label htmlFor={`listaPresentesPadrao.cargo_[${index}]`} className="mt-3">{nomeCampoCargo(membro.identificacao)}</label>
                                                                        <input
                                                                            name={`listaPresentesPadrao[${index}].cargo`}
                                                                            id={`listaPresentesPadrao.cargo_[${index}]`}
                                                                            className="form-control"
                                                                            value={membro.cargo}
                                                                            onChange={(e) => {
                                                                                props.handleChange(e);
                                                                            }}
                                                                            disabled={!membro.editavel}
                                                                        />
                                                                    </div>

                                                                    <div className="col-1">
                                                                        <button
                                                                            id={`listaPresentesPadrao.btn_[${index}]`}
                                                                            type="button"
                                                                            className="btn btn-link mt-5"
                                                                            disabled={errors && errors.listaPresentesPadrao && errors.listaPresentesPadrao[index] && errors.listaPresentesPadrao[index].nome ? errors.listaPresentesPadrao[index].nome : ''}
                                                                            onClick={() => {
                                                                                onClickRemoverAdicionar(remove, index, membro.editavel, values, setFieldValue)
                                                                            }}
                                                                        >
                                                                            {membro.editavel
                                                                                ?
                                                                                    <FontAwesomeIcon
                                                                                        style={{
                                                                                            fontSize: '17px',
                                                                                            marginRight: "4px",
                                                                                            color: "#008000"
                                                                                        }}
                                                                                        icon={faCheckCircle}
                                                                                    />
                                                                                :
                                                                                    <FontAwesomeIcon
                                                                                        style={{
                                                                                            fontSize: '17px',
                                                                                            marginRight: "4px",
                                                                                            color: "#B40C02"
                                                                                        }}
                                                                                        icon={faTimesCircle}
                                                                                    />
                                                                            }
                                                                            
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}

                                                    <div className="d-flex  justify-content-start mt-3 mb-3">
                                                        <button
                                                            disabled={disableBtnAdicionarPresente}
                                                            type="button"
                                                            className="btn btn btn-outline-success mt-2 mr-2"
                                                            onClick={() => {
                                                                setDisableBtnAdicionarPresente(true)
                                                                setDisableBtnSalvar(true)
                                                                push({
                                                                    ata: uuid_ata,
                                                                    cargo: '',
                                                                    identificacao: '',
                                                                    editavel: true,
                                                                    nome: '',
                                                                    membro: false
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

                                        <p className="titulo mt-4"><strong>Manifestações, Comentários e Justificativas</strong></p>
                                        <div className="form-row">
                                            <div className="col-12">
                                                <label htmlFor="stateFormEditarAta.comentarios" className="mb-0">Utilize esse campo para registrar possíveis dúvidas, discussões, esclarecimentos aparecidos durante a reunião</label>
                                                <textarea
                                                    rows="3"
                                                    placeholder="Escreva seu texto aqui"
                                                    value={values.stateFormEditarAta.comentarios}
                                                    onChange={props.handleChange}
                                                    name="stateFormEditarAta.comentarios"
                                                    className="form-control mt-2"
                                                    disabled={!podeEditarAta}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="form-row mt-3">
                                            <div className="col-5 mt-2">
                                                <label htmlFor="stateFormEditarAta.parecer_conselho"><strong>Como os presentes se posicionam à prestação de contas apresentada ? </strong></label>
                                            </div>

                                            <div className="col-7">
                                                <select
                                                    value={values.stateFormEditarAta.parecer_conselho}
                                                    onChange={props.handleChange}
                                                    name="stateFormEditarAta.parecer_conselho"
                                                    className="form-control"
                                                    disabled={!podeEditarAta}
                                                >
                                                    {tabelas && tabelas.pareceres && tabelas.pareceres.map((tipo) =>
                                                        <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                                    )}
                                                </select>
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
};