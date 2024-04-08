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
import {RetornaSeTemPermissaoEdicaoHistoricoDeMembros} from "../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";

export const FormCadastro = ({
    cargo, 
    onSubmitForm, 
    composicaoUuid, 
    switchStatusPresidente, 
    cargosDaDiretoriaExecutiva, 
    responsavelPelasAtribuicoes,
    onInformarSaida
}) => {

    const {isLoading, data} = useGetComposicao(composicaoUuid)

    const TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS = RetornaSeTemPermissaoEdicaoHistoricoDeMembros()

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
        data_fim_no_cargo_composicao_mais_recente: cargo.uuid ? cargo.data_fim_no_cargo_composicao_mais_recente : null,
        telefone: cargo.ocupante_do_cargo.telefone,
        cep: cargo.ocupante_do_cargo.cep,
        bairro : cargo.ocupante_do_cargo.bairro,
        endereco : cargo.ocupante_do_cargo.endereco,
        email : cargo.ocupante_do_cargo.email,
        switch_status_presidente : switchStatusPresidente,
        responsavel_pelas_atribuicoes : responsavelPelasAtribuicoes,
        substituto: cargo.substituto,
        substituido: cargo.substituido,
    };
    const telefoneMaskContitional = (value) => {
        let telefone = value.replace(/\D+/g, "");
        let mascara;
        if (telefone.length <= 10) {
            mascara = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        } else {
            mascara = ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        }
        return mascara
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
            // A ordem de setFieldValue('email', '') primeiro e setFieldValue('nome', '') depois É IMPORTANTE! NÃO ALTERAR
            // Para evitar compontamento indesejado no YupSignupSchemaHistoricoDeMembros
            setFieldValue('email', '')
            setFieldValue('nome', '')
            try {
                if (values.codigo_identificacao.trim()){
                    let servidor = await consultarRFNoSmeIntegracao(values.codigo_identificacao.trim());
                    if (servidor.status === 200 || servidor.status === 201) {
                        // A ordem de setFieldValue('email', '') primeiro e setFieldValue('nome', '') depois É IMPORTANTE! NÃO ALTERAR
                        // Para evitar compontamento indesejado no YupSignupSchemaHistoricoDeMembros
                        setFieldValue('email', servidor.data.email)
                        setFieldValue('nome', servidor.data.nome)
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

    const retornaSeEhPresidente = () => {
        return cargo.cargo_associacao === 'PRESIDENTE_DIRETORIA_EXECUTIVA'
    }

    const retornaSeEhComposicaoVigente = () => {
        return cargo.eh_composicao_vigente
    }

    const retornaSePeriodoFinalEhDisable = () =>{
        if(cargo && cargo.id){
            return false;
        }

        return true;
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
                                retornaSeEhComposicaoVigente={retornaSeEhComposicaoVigente}
                                onInformarSaida={() => onInformarSaida(props.values, data)}
                            />

                            <div className='row mt-3'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label><span className='asterisco-vermelho'>* </span>Cargo na Associação</label>
                                        <input
                                            type="text"
                                            value={props.values.cargo_associacao_label ? props.values.cargo_associacao_label : ""}
                                            onChange={props.handleChange}
                                            name="cargo_associacao"
                                            className="form-control"
                                            disabled={true}
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
                                            disabled={!retornaSeEhComposicaoVigente() || cargo.uuid || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
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
                                            <label><span className='asterisco-vermelho'>* </span>{props.values.representacao === 'SERVIDOR' ? "Registro Funcional" : "Código EOL"}
                                            </label>
                                            <input
                                                type="text"
                                                value={props.values.codigo_identificacao ? props.values.codigo_identificacao : ""}
                                                onChange={props.handleChange}
                                                name="codigo_identificacao"
                                                className="form-control"
                                                onBlur={()=>getInfoPeloCodigoIdentificacao(props.values, setFieldValue, setFieldError)}
                                                disabled={!retornaSeEhComposicaoVigente() || cargo.uuid || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
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
                                                type="text"
                                                value={props.values.cargo_educacao ? props.values.cargo_educacao : ""}
                                                onChange={props.handleChange}
                                                name="cargo_educacao"
                                                className="form-control"
                                                disabled={true}
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
                                            type="text"
                                            value={props.values.nome ? props.values.nome : ""}
                                            onChange={props.handleChange}
                                            name="nome"
                                            className="form-control"
                                            disabled={!retornaSeEhComposicaoVigente() || (props.values.representacao === "SERVIDOR" || props.values.representacao === "ESTUDANTE") || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                        />
                                        {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                {(props.values.representacao === 'PAI_RESPONSAVEL' || props.values.representacao === 'ESTUDANTE') &&
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label><span className='asterisco-vermelho'>* </span>{props.values.representacao === 'PAI_RESPONSAVEL' ? "CPF do pai ou responsável" : "CPF"}</label>
                                            <MaskedInput
                                                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                                type="text"
                                                value={props.values.cpf_responsavel ? props.values.cpf_responsavel : ""}
                                                onChange={props.handleChange}
                                                name="cpf_responsavel"
                                                className="form-control"
                                                readOnly={!retornaSeEhComposicaoVigente() || (!cargo.uuid ? props.values.representacao !== 'PAI_RESPONSAVEL' && props.values.representacao !== 'ESTUDANTE' : true) || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                            />
                                            {props.errors.cpf_responsavel && <span className="span_erro text-danger mt-1"> {props.errors.cpf_responsavel}</span>}
                                        </div>
                                    </div>
                                }
                            </div>

                            {retornaSeEhPresidente() &&
                                <>
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
                                                    disabled={!retornaSeEhComposicaoVigente() || (!cargo.uuid ? retornaSeCampoEhDisabled(props.values) : !retornaSeEhPresidente()) || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                                />
                                                {props.errors.telefone && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.telefone}</span>}
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
                                                    disabled={!retornaSeEhComposicaoVigente() || (!cargo.uuid ? retornaSeCampoEhDisabled(props.values) : !retornaSeEhPresidente()) || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                                />
                                                {props.errors.cep && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.cep}</span>}
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
                                                    disabled={!retornaSeEhComposicaoVigente() || (!cargo.uuid ? retornaSeCampoEhDisabled(props.values) : !retornaSeEhPresidente()) || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                                />
                                                {props.errors.bairro && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.bairro}</span>}
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
                                                    disabled={!retornaSeEhComposicaoVigente() || (!cargo.uuid ? retornaSeCampoEhDisabled(props.values) : !retornaSeEhPresidente()) || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                                />
                                                {props.errors.endereco && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.endereco}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }

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
                                            disabled={!retornaSeEhComposicaoVigente() || (!cargo.uuid ? retornaSeCampoEhDisabled(props.values) : false) || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                        />
                                        {props.errors.email &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
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
                                            disabled={!retornaSeEhComposicaoVigente() || retornaSeCampoEhDisabled(props.values) || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                        />
                                        {props.errors.data_inicio_no_cargo && <span
                                            className="span_erro text-danger mt-1"> {props.errors.data_inicio_no_cargo}</span>}
                                    </div>
                                </div>
                                {
                                    props.values.data_fim_no_cargo_composicao_mais_recente ? (
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label><span className='asterisco-vermelho'>* </span>Período final de ocupação</label>
                                                <DatePickerField
                                                    name="data_fim_no_cargo"
                                                    value={props.values.data_fim_no_cargo_composicao_mais_recente ? props.values.data_fim_no_cargo_composicao_mais_recente : ""}
                                                    onChange={setFieldValue}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label><span className='asterisco-vermelho'>* </span>Período final de ocupação</label>
                                                <DatePickerField
                                                    name="data_fim_no_cargo"
                                                    value={props.values.data_fim_no_cargo ? props.values.data_fim_no_cargo : ""}
                                                    onChange={setFieldValue}
                                                    minDate={data && data.info_composicao_anterior && data.info_composicao_anterior.data_final ? moment(data.info_composicao_anterior.data_final).toDate() : ""}
                                                    maxDate={data && data.mandato && data.mandato.data_final ? moment(data.mandato.data_final).toDate() : ""}
                                                    // disabled={!retornaSeEhComposicaoVigente() || retornaSePeriodoFinalEhDisable()}
                                                    disabled
                                                />
                                                {props.errors.data_fim_no_cargo && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.data_fim_no_cargo}</span>}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            {retornaSeEhPresidente() &&
                                <>
                                    <hr/>
                                    <div className='d-flex align-items-center'>
                                        <div className='col-6 pl-0'>
                                            <span className='mr-2'>Status de ocupação: </span>
                                            <Switch
                                                onChange={(value) => props.setFieldValue("switch_status_presidente", value)}
                                                checked={props.values.switch_status_presidente}
                                                name="switch_status_presidente"
                                                checkedChildren="Presente"
                                                unCheckedChildren="Ausente"
                                                className={`switch-status-presidente ${props.values.switch_status_presidente ? "switch-status-presidente-checked" : ""}`}
                                                disabled={!retornaSeEhComposicaoVigente() || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                            />
                                        </div>

                                        {!props.values.switch_status_presidente &&
                                            <div className='col-6'>
                                                <div className="row d-flex align-items-center">
                                                    <div className='col-auto'>
                                                        <label className='mb-0' htmlFor="responsavel_pelas_atribuicoes">Responsável pelas atribuições</label>
                                                    </div>
                                                    <div className='col-auto'>
                                                        <select
                                                            value={props.values.responsavel_pelas_atribuicoes}
                                                            onChange={props.handleChange}
                                                            name="responsavel_pelas_atribuicoes"
                                                            className="form-control"
                                                            disabled={!retornaSeEhComposicaoVigente() || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
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