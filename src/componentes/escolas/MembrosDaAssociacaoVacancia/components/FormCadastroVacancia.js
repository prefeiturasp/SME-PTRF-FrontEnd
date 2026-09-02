
import React from "react";
import MaskedInput from "react-text-mask";
import {Formik} from "formik";
import {YupSignupSchemaHistoricoDeMembrosVacancia} from "../YupSignupSchemaHistoricoDeMembrosVacancia";
import {TopoComBotoesFormCadastroHistoricoDeMembrosVacancia} from "./TopoComBotoesFormCadastroHistoricoDeMembrosVacancia";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {consultarCodEolNoSmeIntegracao, consultarRFNoSmeIntegracao, getCargosDoRFSmeIntegracao} from "../../../../services/MandatosVacancia.service";
import moment from "moment/moment";
import {RetornaSeTemPermissaoEdicaoHistoricoDeMembros} from "../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";

export const FormCadastroVacancia = ({
    cargo,
    mandato,
    onSubmitForm,
    onInformarSaida,
    ehEdicao,
    ocupanteVigente,
    podeCancelarSaida, onCancelarSaida,
    podeCancelarEntrada, onCancelarEntrada,
    marcoSelecionado,
    }) => {

    const TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS = RetornaSeTemPermissaoEdicaoHistoricoDeMembros()
    const ehCargoVagoVigente = cargo?.cargo_vago_vigente === true;

    const initFormMembro = {
        nome: cargo?.ocupante_do_cargo?.nome || '',
        cpf_responsavel: cargo?.ocupante_do_cargo?.cpf_responsavel || '',
        cargo_associacao: cargo?.cargo_associacao || '',
        cargo_associacao_label: cargo?.cargo_associacao_label || '',
        representacao: cargo?.ocupante_do_cargo?.representacao || '',
        cargo_educacao: cargo?.ocupante_do_cargo?.cargo_educacao || '',
        codigo_identificacao: cargo?.ocupante_do_cargo?.codigo_identificacao || '',
        data_inicio_no_cargo: cargo?.data_inicio_no_cargo || mandato?.data_inicial,
        data_fim_no_cargo: cargo?.data_fim_no_cargo,
        telefone: cargo?.ocupante_do_cargo?.telefone || '',
        cep: cargo?.ocupante_do_cargo?.cep || '',
        bairro: cargo?.ocupante_do_cargo?.bairro || '',
        endereco: cargo?.ocupante_do_cargo?.endereco || '',
        email: cargo?.ocupante_do_cargo?.email || '',
    };

    const telefoneMaskContitional = (value) => {
        let telefone = value.replace(/\D+/g, "");
        return telefone.length <= 10
            ? ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
            : ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    };

    const limparCampos = (setFieldValue) => {
        setFieldValue('nome', '');
        setFieldValue('codigo_identificacao', '');
        setFieldValue('cargo_educacao', '');
        setFieldValue('cpf_responsavel', '');
        setFieldValue('telefone', '');
        setFieldValue('cep', '');
        setFieldValue('bairro', '');
        setFieldValue('endereco', '');
        setFieldValue('email', '');
    };

    const ehRespostaComSucesso = (response) => response.status === 200 || response.status === 201;

    const tratarErroCodigoIdentificacao = (e, setFieldError) => {
        const detail = e.response?.data?.detail;
        if (detail) {
            setFieldError('codigo_identificacao', detail);
        }
    };

    const preencheDadosServidor = async (codigo, setFieldValue, setFieldError) => {
        setFieldValue('cargo_educacao', '');
        setFieldValue('email', '');
        setFieldValue('nome', '');
        if (!codigo) return;

        try {
            const servidor = await consultarRFNoSmeIntegracao(codigo);
            if (ehRespostaComSucesso(servidor)) {
                setFieldValue('email', servidor.data.email);
                setFieldValue('nome', servidor.data.nome);
            }

            const cargos = await getCargosDoRFSmeIntegracao(codigo);
            if (ehRespostaComSucesso(cargos) && cargos.data?.cargos?.length > 0) {
                setFieldValue('cargo_educacao', cargos.data.cargos[0].nomeCargo);
            }
        } catch (e) {
            tratarErroCodigoIdentificacao(e, setFieldError);
        }
    };

    const preencheDadosEstudante = async (codigo, setFieldValue, setFieldError) => {
        setFieldValue('nome', '');
        if (!codigo) return;

        try {
            const codEol = await consultarCodEolNoSmeIntegracao(codigo);
            if (ehRespostaComSucesso(codEol)) {
                setFieldValue('nome', codEol.data.nomeAluno);
            }
        } catch (e) {
            tratarErroCodigoIdentificacao(e, setFieldError);
        }
    };

    const getInfoPeloCodigoIdentificacao = async (values, setFieldValue, setFieldError) => {
        const codigo = values.codigo_identificacao.trim();

        if (values.representacao === "SERVIDOR") {
            await preencheDadosServidor(codigo, setFieldValue, setFieldError);
        } else if (values.representacao === "ESTUDANTE") {
            await preencheDadosEstudante(codigo, setFieldValue, setFieldError);
        }
    };

    const retornaSeEhPresidente = (cargoAssociacao) => cargoAssociacao === 'PRESIDENTE_DIRETORIA_EXECUTIVA';

    const onKeyDown = (keyEvent) => {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    };

    return (
        <div className='p-2 pt-3 FormCadastroVacancia'>
            <Formik
                initialValues={initFormMembro}
                onSubmit={onSubmitForm}
                validationSchema={YupSignupSchemaHistoricoDeMembrosVacancia}
                enableReinitialize={true}
            >
                {props => {
                    const {setFieldError, setFieldValue} = props;
                    
                    return (
                        <form onSubmit={props.handleSubmit} onKeyDown={onKeyDown}>
                            <TopoComBotoesFormCadastroHistoricoDeMembrosVacancia
                                mandato={mandato}
                                isValid={props.isValid}
                                onInformarSaida={onInformarSaida}
                                ehEdicao={ehEdicao}
                                ocupanteVigente={ocupanteVigente}
                                podeCancelarSaida={podeCancelarSaida}
                                onCancelarSaida={onCancelarSaida}
                                podeCancelarEntrada={podeCancelarEntrada}
                                onCancelarEntrada={onCancelarEntrada}
                                marcoSelecionado={marcoSelecionado}
                            />

                            <div className='row mt-3'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label><span className='asterisco-vermelho'>* </span>Cargo na Associação</label>
                                        <input
                                            type="text"
                                            value={props.values.cargo_associacao_label || ""}
                                            onChange={props.handleChange}
                                            name="cargo_associacao"
                                            className="form-control"
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="representacao-associacao"><span className='asterisco-vermelho'>* </span>Representação na associação</label>
                                        <select
                                            id="representacao-associacao"
                                            value={props.values.representacao || ""}
                                            onChange={props.handleChange}
                                            onBlur={() => limparCampos(setFieldValue)}
                                            name="representacao"
                                            className="form-control"
                                            disabled={ehEdicao || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
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
                                            <label htmlFor="codigo-identificacao"><span className='asterisco-vermelho'>* </span>{props.values.representacao === 'SERVIDOR' ? "Registro Funcional" : "Código EOL"}</label>
                                            <input
                                                id="codigo-identificacao"
                                                type="text"
                                                value={props.values.codigo_identificacao || ""}
                                                onChange={props.handleChange}
                                                name="codigo_identificacao"
                                                className="form-control"
                                                onBlur={() => getInfoPeloCodigoIdentificacao(props.values, setFieldValue, setFieldError)}
                                                disabled={ehEdicao || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                            />
                                            {props.errors.codigo_identificacao && <span className="span_erro text-danger mt-1"> {props.errors.codigo_identificacao}</span>}
                                        </div>
                                    </div>
                                }
                                {props.values.representacao === "SERVIDOR" &&
                                    <div className="col-6 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="cargo-educacao">Cargo na educação</label>
                                            <input
                                                id="cargo-educacao"
                                                type="text"
                                                value={props.values.cargo_educacao || ""}
                                                onChange={props.handleChange}
                                                name="cargo_educacao"
                                                className="form-control"
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className='row mt-3'>
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="nome-completo"><span className='asterisco-vermelho'>* </span>Nome Completo</label>
                                        <input
                                            id='nome-completo'
                                            type="text"
                                            value={props.values.nome || ""}
                                            onChange={props.handleChange}
                                            name="nome"
                                            className="form-control"
                                            disabled={(props.values.representacao === "SERVIDOR" || props.values.representacao === "ESTUDANTE") || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                        />
                                        {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                {(props.values.representacao === 'PAI_RESPONSAVEL' || props.values.representacao === 'ESTUDANTE') &&
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="cpf-responsavel"><span className='asterisco-vermelho'>* </span>{props.values.representacao === 'PAI_RESPONSAVEL' ? "CPF do pai ou responsável" : "CPF"}</label>
                                            <MaskedInput
                                                id="cpf-responsavel"
                                                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                                type="text"
                                                value={props.values.cpf_responsavel || ""}
                                                onChange={props.handleChange}
                                                name="cpf_responsavel"
                                                className="form-control"
                                                readOnly={ehEdicao || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                            />
                                            {props.errors.cpf_responsavel && <span className="span_erro text-danger mt-1"> {props.errors.cpf_responsavel}</span>}
                                        </div>
                                    </div>
                                }
                            </div>

                            {retornaSeEhPresidente(props.values.cargo_associacao) &&
                                <>
                                    <div className='row mt-3'>
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="telefone-membro">Telefone</label>
                                                <MaskedInput
                                                    id="telefone-membro"
                                                    mask={(valor) => telefoneMaskContitional(valor)}
                                                    value={props.values.telefone || ""}
                                                    onChange={props.handleChange}
                                                    name="telefone"
                                                    className="form-control"
                                                    disabled={!TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="cep-membro">CEP</label>
                                                <MaskedInput
                                                    id="cep-membro"
                                                    mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                                                    value={props.values.cep || ""}
                                                    onChange={props.handleChange}
                                                    name="cep"
                                                    className="form-control"
                                                    disabled={!TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row mt-3'>
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="bairro-membro">Bairro</label>
                                                <input
                                                    id="bairro-membro"
                                                    type="text"
                                                    value={props.values.bairro || ""}
                                                    onChange={props.handleChange}
                                                    name="bairro"
                                                    className="form-control"
                                                    disabled={!TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="endereco-membro">Endereço</label>
                                                <input
                                                    id="endereco-membro"
                                                    type="text"
                                                    value={props.values.endereco || ""}
                                                    onChange={props.handleChange}
                                                    name="endereco"
                                                    className="form-control"
                                                    disabled={!TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }

                            <div className='row mt-3'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="email-membro">E-mail</label>
                                        <input
                                            type="text"
                                            value={props.values.email || ""}
                                            onChange={props.handleChange}
                                            name="email"
                                            className="form-control"
                                            id="email-membro"
                                            disabled={!TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS}
                                        />
                                        {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className='row'>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="data-inicio-no-cargo">
                                            <span className='asterisco-vermelho'></span>Período inicial de ocupação</label>
                                        <DatePickerField
                                            id="data-inicio-no-cargo"
                                            name="data_inicio_no_cargo"
                                            value={props.values.data_inicio_no_cargo || ""}
                                            onChange={setFieldValue}
                                            minDate={mandato ? moment(mandato.data_inicial).toDate() : ""}
                                            maxDate={mandato ? moment(mandato.data_final).toDate() : ""}
                                            disabled={ehEdicao || !TEM_PERMISSAO_EDICAO_HISTORICO_DE_MEMBROS || !ehCargoVagoVigente}
                                        />
                                        {props.errors.data_inicio_no_cargo && <span className="span_erro text-danger mt-1"> {props.errors.data_inicio_no_cargo}</span>}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="data-fim-no-cargo">
                                            <span className='asterisco-vermelho'> </span>Período final de ocupação</label>
                                        <DatePickerField
                                            id="data-fim-no-cargo"
                                            name="data_fim_no_cargo"
                                            value={props.values.data_fim_no_cargo || moment(mandato.data_final).toDate()}
                                            onChange={setFieldValue}
                                            minDate={mandato ? moment(mandato.data_inicial).toDate() : ""}
                                            maxDate={mandato ? moment(mandato.data_final).toDate() : ""}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        </div>
    )
}