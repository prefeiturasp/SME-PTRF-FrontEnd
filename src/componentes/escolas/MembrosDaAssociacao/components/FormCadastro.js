import React from "react";
import MaskedInput from "react-text-mask";
import {Formik} from "formik";
import {YupSignupSchemaHistoricoDeMembros} from "../YupSignupSchemaHistoricoDeMembros";
import {TopoComBotoesFormCadastroHistoricoDeMembros} from "./TopoComBotoesFormCadastroHistoricoDeMembros";
import {DatePickerField} from "../../../Globais/DatePickerField";

import {consultarCodEolNoSmeIntegracao, consultarRFNoSmeIntegracao, getCargosDoRFSmeIntegracao} from "../../../../services/Mandatos.service";

import {useGetComposicao} from "../hooks/useGetComposicao";
import moment from "moment/moment";
import Loading from "../../../../utils/Loading";
import {Switch} from "antd";

export const FormCadastro = ({cargo, onSubmitForm, composicaoUuid, switchStatusPresidente, handleChangeSwitchStatusPresidente, cargosDaDiretoriaExecutiva, responsavelPelasAtribuicoes, handleChangeResponsavelPelaAtribuicao}) => {

    const {isLoading, data} = useGetComposicao(composicaoUuid)

    const initFormMembro = {
        nome: cargo.ocupante_do_cargo.nome,
        cpf_responsavel: cargo.ocupante_do_cargo.cpf_responsavel,
        cargo_associacao: cargo.cargo_associacao,
        cargo_associacao_label: cargo.cargo_associacao_label,
        representacao: cargo.ocupante_do_cargo.representacao,
        cargo_educacao: cargo.ocupante_do_cargo.cargo_educacao,
        codigo_identificacao: cargo.ocupante_do_cargo.codigo_identificacao,
        data_inicio_no_cargo: cargo.uuid ? cargo.data_inicio_no_cargo : data ? data.data_inicial : "",
        data_fim_no_cargo: cargo.uuid ? cargo.data_fim_no_cargo : data ? data.data_final : "",
        telefone: cargo.ocupante_do_cargo.telefone,
        cep: cargo.ocupante_do_cargo.cep,
        bairro : cargo.ocupante_do_cargo.bairro,
        endereco : cargo.ocupante_do_cargo.endereco,
        email : cargo.ocupante_do_cargo.email,
        switch_status_presidente : switchStatusPresidente,
        responsavel_pelas_atribuicoes : responsavelPelasAtribuicoes,
    };

    const telefoneMaskContitional = (value) => {
        let telefone = value.replace(/[^\d]+/g, "");
        let mask;
        if (telefone.length <= 10) {
            mask = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        } else {
            mask = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        }
        return mask
    }

    const limparCampos = (values, setFieldValue) =>{
        setFieldValue('nome', '');
        setFieldValue('codigo_identificacao', '');
        setFieldValue('cargo_educacao', '');
        setFieldValue('cpf_responsavel', '');
        setFieldValue('telefone', '');
        setFieldValue('cep', '');
        setFieldValue('bairro', '');
        setFieldValue('endereco', '');
        setFieldValue('email', '');
    }

    const getInfoPeloCodigoIdentificacao = async (values, setFieldValue, setFieldError) => {
        if (values.representacao === "SERVIDOR") {
            setFieldValue('cargo_educacao', '')
            setFieldValue('nome', '')
            setFieldValue('email', '')
            try {
                if (values.codigo_identificacao.trim()){
                    let servidor = await consultarRFNoSmeIntegracao(values.codigo_identificacao.trim());
                    if (servidor.status === 200 || servidor.status === 201) {
                        setFieldValue('nome', servidor.data.nome)
                        setFieldValue('email', servidor.data.email)
                    }
                    let cargos = await getCargosDoRFSmeIntegracao(values.codigo_identificacao.trim())
                    if (cargos.status === 200 || cargos.status === 201) {
                        if (cargos.data && cargos.data.cargos && cargos.data.cargos.length > 0){
                            setFieldValue('cargo_educacao', cargos.data.cargos[0].nomeCargo)
                        }
                    }
                }
            } catch (e) {
                let data = e.response.data;
                if (data !== undefined && data.detail !== undefined) {
                    setFieldError('codigo_identificacao', data.detail);
                }
            }
        }else if (values.representacao === "ESTUDANTE") {
            setFieldValue('nome', '')
            try {
                if (values.codigo_identificacao.trim()){
                    let cod_eol = await consultarCodEolNoSmeIntegracao(values.codigo_identificacao.trim());
                    if (cod_eol.status === 200 || cod_eol.status === 201) {
                        setFieldValue('nome', cod_eol.data.nomeAluno)
                    }
                }
            }catch (e) {
                let data = e.response.data;
                if (data !== undefined && data.detail !== undefined) {
                    setFieldError('codigo_identificacao', data.detail);
                }
            }
        }
    }
    
    const retornaSeCampoEhDisabled = (values) => {

        if (!values.representacao){
            return true
        }
        if (values && values.representacao && values.representacao === "ESTUDANTE"){
            return !values.codigo_identificacao || !values.nome || !values.cpf_responsavel
        }
        if (values && values.representacao && values.representacao === "PAI_RESPONSAVEL"){
            return !values.nome || !values.cpf_responsavel
        }
        if (values && values.representacao && values.representacao === "SERVIDOR"){
            return !values.codigo_identificacao || !values.nome
        }
    }

    if (isLoading) {
        return (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        );
    }

    // Necessário para o evitar o submit quando clicar em Enter
    // e porque o botão de submit está no componente TopoComBotoesFormCadastroHistoricoDeMembros para atender o protótipo
    const onKeyDown = (keyEvent) =>{
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    }

    return(
        <div className='p-2 pt-3'>
            <Formik
                initialValues={initFormMembro}
                onSubmit={onSubmitForm}
                validationSchema={YupSignupSchemaHistoricoDeMembros}
                enableReinitialize={true}
            >
                {props => {
                    const {
                        setFieldError,
                        setFieldValue,
                    } = props;
                    return(
                        <form onSubmit={props.handleSubmit} onKeyDown={onKeyDown}>
                            {/* Necessário chamar de dentro do formulário para que YupSignupSchemaHistoricoDeMembros funcione */}
                            <TopoComBotoesFormCadastroHistoricoDeMembros
                                composicaoUuid={composicaoUuid}
                                cargo={cargo ? cargo : ''}
                                isValid={props.isValid}
                            />

                            <div className='row mt-3'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label><span className='asterisco-vermelho'>* </span>Cargo na Associação</label>
                                        <input
                                            readOnly={true}
                                            type="text"
                                            value={props.values.cargo_associacao_label ? props.values.cargo_associacao_label : ""}
                                            onChange={props.handleChange}
                                            name="cargo_associacao"
                                            className="form-control"
                                        />
                                        {props.errors.cargo_associacao && <span className="span_erro text-danger mt-1"> {props.errors.cargo_associacao}</span>}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label><span className='asterisco-vermelho'>* </span>Representação na associação</label>
                                        <select
                                            value={props.values.representacao ? props.values.representacao : ""}
                                            onChange={props.handleChange}
                                            onBlur={()=>limparCampos(props.values, setFieldValue)}
                                            name="representacao"
                                            className="form-control"
                                            disabled={cargo.uuid}
                                        >
                                            <option value="">Escolha a Representação</option>
                                            <option value="ESTUDANTE">Estudante</option>
                                            <option value='PAI_RESPONSAVEL'>Pai ou responsável</option>
                                            <option value='SERVIDOR'>Servidor</option>
                                        </select>
                                        {props.errors.representacao && <span className="span_erro text-danger mt-1"> {props.errors.representacao}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className={`row`}>
                                {(props.values.representacao === "SERVIDOR" || props.values.representacao === "ESTUDANTE") &&
                                    <div className="col-6 mt-3">
                                        <div className="form-group">
                                            <label>{props.values.representacao === 'SERVIDOR' ? "Registro Funcional" : "Código EOL"}</label>
                                            <input
                                                type="text"
                                                value={props.values.codigo_identificacao ? props.values.codigo_identificacao : ""}
                                                onChange={props.handleChange}
                                                name="codigo_identificacao"
                                                className="form-control"
                                                onBlur={()=>getInfoPeloCodigoIdentificacao(props.values, setFieldValue, setFieldError)}
                                                disabled={cargo.uuid}
                                            />
                                            {props.errors.codigo_identificacao && <span className="span_erro text-danger mt-1"> {props.errors.codigo_identificacao}</span>}
                                        </div>
                                    </div>
                                }
                                {props.values.representacao === "SERVIDOR" &&
                                    <div className="col-6 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="cargo_educacao">Cargo na educação</label>
                                            <input
                                                readOnly={true}
                                                type="text"
                                                value={props.values.cargo_educacao ? props.values.cargo_educacao : ""}
                                                onChange={props.handleChange}
                                                name="cargo_educacao"
                                                className="form-control"
                                            />
                                            {props.errors.cargo_educacao && <span className="span_erro text-danger mt-1"> {props.errors.cargo_educacao}</span>}
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className='row mt-3'>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label><span className='asterisco-vermelho'>* </span>Nome Completo</label>
                                        <input
                                            readOnly={props.values.representacao === "SERVIDOR" || props.values.representacao === "ESTUDANTE"}
                                            type="text"
                                            value={props.values.nome ? props.values.nome : ""}
                                            onChange={props.handleChange}
                                            name="nome"
                                            className="form-control"
                                        />
                                        {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {(props.values.representacao === 'PAI_RESPONSAVEL' || props.values.representacao === 'ESTUDANTE') &&
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label>{props.values.representacao === 'PAI_RESPONSAVEL' ? "CPF do pai ou responsável" : "CPF"} *</label>
                                            <MaskedInput
                                                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                                readOnly={props.values.representacao !== 'PAI_RESPONSAVEL' && props.values.representacao !== 'ESTUDANTE'}
                                                type="text"
                                                value={props.values.cpf_responsavel ? props.values.cpf_responsavel : ""}
                                                onChange={props.handleChange}
                                                name="cpf_responsavel"
                                                className="form-control"
                                            />
                                            {props.errors.cpf_responsavel && <span className="span_erro text-danger mt-1"> {props.errors.cpf_responsavel}</span>}
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className='row mt-3'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Telefone</label>
                                        <MaskedInput
                                            mask={(valor) => telefoneMaskContitional(valor)}
                                            value={props.values.telefone ? props.values.telefone : ""}
                                            onChange={props.handleChange}
                                            name="telefone"
                                            className="form-control"
                                            disabled={retornaSeCampoEhDisabled(props.values)}
                                        />
                                        {props.errors.telefone && <span className="span_erro text-danger mt-1"> {props.errors.telefone}</span>}
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="form-group">
                                        <label>CEP</label>
                                        <MaskedInput
                                            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                                            value={props.values.cep ? props.values.cep : ""}
                                            onChange={props.handleChange}
                                            name="cep"
                                            className="form-control"
                                            disabled={retornaSeCampoEhDisabled(props.values)}
                                        />
                                        {props.errors.cep && <span className="span_erro text-danger mt-1"> {props.errors.cep}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Bairro</label>
                                        <input
                                            type="text"
                                            value={props.values.bairro ? props.values.bairro : ""}
                                            onChange={props.handleChange}
                                            name="bairro"
                                            className="form-control"
                                            disabled={retornaSeCampoEhDisabled(props.values)}
                                        />
                                        {props.errors.bairro && <span className="span_erro text-danger mt-1"> {props.errors.bairro}</span>}
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Endereço</label>
                                        <input
                                            type="text"
                                            value={props.values.endereco ? props.values.endereco : ""}
                                            onChange={props.handleChange}
                                            name="endereco"
                                            className="form-control"
                                            disabled={retornaSeCampoEhDisabled(props.values)}
                                        />
                                        {props.errors.endereco && <span className="span_erro text-danger mt-1"> {props.errors.endereco}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>E-mail</label>
                                        <input
                                            type="text"
                                            value={props.values.email ? props.values.email : ""}
                                            onChange={props.handleChange}
                                            name="email"
                                            className="form-control"
                                            disabled={retornaSeCampoEhDisabled(props.values)}
                                        />
                                        {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className='row'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label><span className='asterisco-vermelho'>* </span>Período inicial de ocupação</label>
                                        <DatePickerField
                                            name="data_inicio_no_cargo"
                                            value={props.values.data_inicio_no_cargo ? props.values.data_inicio_no_cargo : ""}
                                            onChange={setFieldValue}
                                            minDate={data ? moment(data.data_inicial).toDate() : ""}
                                            maxDate={data ? moment(data.data_final).toDate() : ""}
                                            disabled={retornaSeCampoEhDisabled(props.values)}
                                        />
                                        {props.errors.data_inicio_no_cargo && <span className="span_erro text-danger mt-1"> {props.errors.data_inicio_no_cargo}</span>}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label><span className='asterisco-vermelho'>* </span>Período final de ocupação</label>
                                        <DatePickerField
                                            name="data_fim_no_cargo"
                                            value={props.values.data_fim_no_cargo ? props.values.data_fim_no_cargo : ""}
                                            onChange={setFieldValue}
                                            disabled={!cargo.data_final_editavel || retornaSeCampoEhDisabled(props.values)}
                                        />
                                        {props.errors.data_fim_no_cargo && <span className="span_erro text-danger mt-1"> {props.errors.data_fim_no_cargo}</span>}
                                    </div>
                                </div>
                            </div>

                            {cargo && cargo.cargo_associacao === 'PRESIDENTE_DIRETORIA_EXECUTIVA'  &&
                                <>
                                    <hr/>
                                    <div className='d-flex align-items-center'>

                                        <div className='col-6 pl-0'>
                                            <span className='mr-2'>Status de ocupação: </span>
                                            <Switch
                                                onChange={handleChangeSwitchStatusPresidente}
                                                checked={switchStatusPresidente}
                                                name="statusPresidenteSwitch"
                                                checkedChildren="Presente"
                                                unCheckedChildren="Ausente"
                                                className={`switch-status-presidente ${switchStatusPresidente ? "switch-status-presidente-checked" : ""}`}
                                            />
                                        </div>

                                        {!switchStatusPresidente &&
                                            <div className='col-6'>
                                                <div className="row d-flex align-items-center">
                                                    <div className='col-auto'>
                                                        <label className='mb-0' htmlFor="responsavel_pelas_atribuicoes">Responsável pelas atribuições</label>
                                                    </div>

                                                    <div className='col-auto'>
                                                        <select
                                                            value={responsavelPelasAtribuicoes}
                                                            onChange={(e) => {
                                                                handleChangeResponsavelPelaAtribuicao(e.target.value);
                                                            }}
                                                            name="responsavel_pelas_atribuicoes"
                                                            className="form-control"
                                                        >
                                                            <option value=''>Escolha o responsável</option>
                                                            {cargosDaDiretoriaExecutiva && cargosDaDiretoriaExecutiva.length > 0 && cargosDaDiretoriaExecutiva.filter(element => element.id !== "PRESIDENTE_DIRETORIA_EXECUTIVA").map((responsavel)=>
                                                                <option key={responsavel.id} value={responsavel.id}>{responsavel.nome}</option>
                                                            )}
                                                        </select>
                                                        {props.errors.responsavel_pelas_atribuicoes && <span className="span_erro text-danger mt-1"> {props.errors.responsavel_pelas_atribuicoes}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </>

                            }
                        </form>
                    );
                }}
            </Formik>
        </div>
    )
}