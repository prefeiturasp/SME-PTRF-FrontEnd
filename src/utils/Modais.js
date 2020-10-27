import React from "react";
import {
    ModalBootstrap,
    ModalBootstrapReverConciliacao,
    ModalBootstrapSaldoInsuficiente,
    ModalBootstrapSaldoInsuficienteDaconta,
    ModalBootstrapEditarAta,
    ModalBootstrapFormMembros,
    ModalBootstrapFormMeusDadosSenha,
    ModalBootstrapFormMeusDadosEmail
} from "../componentes/Globais/ModalBootstrap";
import {DatePickerField} from "../componentes/Globais/DatePickerField";
import {FormAlterarSenha} from "../componentes/Globais/EdicaoDeSenha/FormAlterarSenha";
import {TextoValidacaoSenha} from "../componentes/Globais/MedidorForcaSenha/textoValidacaoSenha";
import {FormAlterarEmail} from "../componentes/Globais/FormAlterarEmail";
import {InformacoesDevolucaoAoTesouro} from "../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/InformacoesDevolucaoAoTesouro";

import {Formik} from 'formik';
import {YupSignupSchemaMembros} from "./ValidacoesAdicionaisFormularios";

export const AvisoCapitalModal = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Aviso"
            bodyText="<p>A relação de bens de
capital é a mesma utilizada no Sistema de Bens Patrimoniais Móveis (SBPM) da Prefeitura de São Paulo e, portanto, contém itens que não podem ser adquiridos com recursos do PTRF.</p>"
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Estou Ciente"
        />
    )
};

export const CancelarModal = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Cancelar cadastro"
            bodyText="<p>Tem certeza que deseja cancelar esse cadastramento? As informações não serão salvas</p>"
            primeiroBotaoOnclick={propriedades.onCancelarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const CancelarModalReceitas = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Deseja cancelar a inclusão de Crédito?"
            bodyText=""
            primeiroBotaoOnclick={propriedades.onCancelarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const DeletarModal = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Deseja excluir esta Despesa?"
            bodyText="<p>Tem certeza que deseja excluir esta despesa? A ação não poderá ser desfeita.</p>"
            primeiroBotaoOnclick={propriedades.onDeletarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};
export const DeletarModalReceitas = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Deseja excluir este Crédito?"
            bodyText="<p>Tem certeza que deseja excluir este crédito? A ação não poderá ser desfeita.</p>"
            primeiroBotaoOnclick={propriedades.onDeletarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const CancelarModalAssociacao = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Deseja cancelar a Edição da Associacao?"
            bodyText="<p>Tem certeza que deseja cancelar a edição? A ação não poderá ser desfeita.</p>"
            primeiroBotaoOnclick={propriedades.onCancelarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const SalvarModalAssociacao = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Edição salva"
            bodyText="<p>A edição foi salva com sucesso!</p>"
            primeiroBotaoOnclick={propriedades.onCancelarTrue}
            primeiroBotaoTexto="OK"
        />
    )
};

export const RedirectModalTabelaLancamentos = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Edição do lançamento"
            bodyText="<p>Você será direcionado para a página de edição desse lançamento, deseja continuar?</p>"
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Não"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={propriedades.onCancelarTrue}
            segundoBotaoTexto="Sim, leve-me à página de edição"
            segundoBotaoCss="success"
        />
    )
};


export const CancelarPrestacaoDeContas = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Deseja cancelar a conciliação?"
            bodyText="<p>Você será direcionado para a página prestação de contas, deseja continuar?</p>"
            primeiroBotaoOnclick={propriedades.onCancelarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const SalvarPrestacaoDeContas = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Salvar informações"
            bodyText="<p>Deseja salvar as informações da conciliação bancária?</p>"
            primeiroBotaoOnclick={propriedades.onSalvarTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const ConcluirPrestacaoDeContas = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Deseja concluir a conciliação?"
            bodyText="<p>Ela poderá ser revisada se desejar.</p>"
            primeiroBotaoOnclick={propriedades.onConcluirTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const ErroGeral = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Ooops!!! Algum erro aconteceu"
            bodyText="<p>Tente atualizar a página e repetir a operação</p>"
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Fechar"
        />
    )
};

export const ReverConciliacao = (propriedades) => {
    const bodyTextarea = () => {
        return (
            <form className="form-group">
                <p><strong>Revisão dos lançamentos realizados no período: Ao rever os lançamentos deste período, você
                    permitirá que alterações sejam feitas nos dados da Associação e cadastro de créditos e
                    despesas.</strong></p>
                <label htmlFor="reabrir-periodo">Escreva abaixo o motivo da revisão dos lançamentos</label>
                <textarea
                    rows="3"
                    placeholder="Escreva o motivo"
                    value={propriedades.textareaModalReverConciliacao}
                    onChange={propriedades.handleChangeModalReverConciliacao}
                    name="reabrir-periodo"
                    className="form-control"
                />
            </form>
        )

    };
    return (
        <ModalBootstrapReverConciliacao
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Reabertura prévia da prestação de contas do período"
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={propriedades.reabrirPeriodo}
            segundoBotaoTexto="Salvar e reabrir o período"
            segundoBotaoCss={propriedades.textareaModalReverConciliacao.trim() === "" ? "dark" : "success"}
            segundoBotaoDisable={propriedades.textareaModalReverConciliacao.trim() === ""}
        />

    )
};

export const SaldoInsuficiente = (propriedades) => {

    const listaDeSaldosInsuficientes = () => {

        return (
            <>
                <p>Não há saldo disponível para a despesa cadastrada, nas ações/aplicações abaixo. Você deseja
                    cadastrá-la mesmo assim?</p>
                {propriedades.saldosInsuficientesDaAcao && propriedades.saldosInsuficientesDaAcao.length > 0 && propriedades.saldosInsuficientesDaAcao.map((item, index) =>
                    <ul key={index} className="list-group list-group-flush mb-3">
                        <li className="list-group-item p-0">
                            <strong>Ação:</strong> {item.acao}
                        </li>
                        <li className="list-group-item p-0">
                            <strong>Aplicacao:</strong> {item.aplicacao}
                        </li>
                        <li className="list-group-item p-0">
                            <strong>Saldo Disponível:</strong> {item.saldo_disponivel.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}
                        </li>
                        <li className="list-group-item p-0" key={index}>
                            <strong>Total dos rateios:</strong> {item.total_rateios.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}
                        </li>
                    </ul>
                )
                }
            </>
        )
    };
    return (
        <ModalBootstrapSaldoInsuficiente
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Saldo Insuficiente"
            bodyText={listaDeSaldosInsuficientes()}
            primeiroBotaoOnclick={propriedades.onSaldoInsuficienteTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const SaldoInsuficienteConta = (propriedades) => {

    const listaDeSaldosInsuficientes = () => {

        return (
            <>
                <p>Não há saldo disponível para a despesa cadastrada na conta
                    selecionada. {propriedades.saldosInsuficientesDaConta.aceitar_lancamento ? "Deseja salvar assim mesmo?" : ""}</p>
                {propriedades.saldosInsuficientesDaConta.saldos_insuficientes && propriedades.saldosInsuficientesDaConta.saldos_insuficientes.length > 0 && propriedades.saldosInsuficientesDaConta.saldos_insuficientes.map((item, index) =>
                    <ul key={index} className="list-group list-group-flush mb-3">
                        <li className="list-group-item p-0">
                            <strong>Conta:</strong> {item.conta}
                        </li>
                        <li className="list-group-item p-0">
                            <strong>Saldo Disponível:</strong> {item.saldo_disponivel.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}
                        </li>
                        <li className="list-group-item p-0" key={index}>
                            <strong>Total dos rateios:</strong> {item.total_rateios.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}
                        </li>
                    </ul>
                )
                }
            </>
        )
    };
    return (
        <ModalBootstrapSaldoInsuficienteDaconta
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Saldo da Conta Insuficiente"
            bodyText={listaDeSaldosInsuficientes()}
            aceitarLancamento={propriedades.saldosInsuficientesDaConta.aceitar_lancamento}
            primeiroBotaoOnclick={propriedades.onSaldoInsuficienteContaTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
};

export const PeriodoFechado = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Período Fechado"
            bodyText="Este período está fechado, para inclusão ou edição de lançamentos (créditos ou despesas) é necessário reabrir o processo de prestação de contas. Deseja ir para a página de Prestação de Contas?"
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Não"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={() => {window.location.assign("/prestacao-de-contas")}}
            segundoBotaoTexto="Sim"
            segundoBotaoCss="success"
        />
    )
};

export const EditarAta = ({dadosAta, show, handleClose, onSubmitEditarAta, onChange, stateFormEditarAta, tabelas}) => {
    const bodyTextarea = () => {
        return (
            <form className="form-group">
                <div className="row">

                    <div className='col-12 col-md-6'>
                        <label htmlFor="tipo_reuniao">Tipo de Reunião</label>
                        <select
                            value={stateFormEditarAta.tipo_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="tipo_reuniao"
                            className="form-control"
                        >
                            {tabelas && tabelas.tipos_reuniao && tabelas.tipos_reuniao.map((tipo) =>
                                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                            )}

                        </select>

                        <label htmlFor="local_reuniao" className="mt-3">Local da reunião</label>
                        <input
                            value={stateFormEditarAta.local_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="local_reuniao"
                            className="form-control"
                        />

                        <label htmlFor="presidente_reuniao" className="mt-3">Presidente da reunião</label>
                        <input
                            value={stateFormEditarAta.presidente_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="presidente_reuniao"
                            className="form-control"
                        />

                        <label htmlFor="secretario_reuniao" className="mt-3">Secretário da reunião</label>
                        <input
                            value={stateFormEditarAta.secretario_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="secretario_reuniao"
                            className="form-control"
                        />

                    </div>

                    <div className='col-12 col-md-6'>
                        <label htmlFor="data_reuniao">Data</label>
                        <DatePickerField
                            name="data_reuniao"
                            value={stateFormEditarAta.data_reuniao}
                            onChange={onChange}
                        />

                        <label htmlFor="convocacao" className="mt-3">Abertura da reunião</label>
                        <select
                            value={stateFormEditarAta.convocacao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="convocacao"
                            className="form-control"
                        >
                            {tabelas && tabelas.convocacoes && tabelas.convocacoes.map((tipo) =>
                                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                            )}
                        </select>

                        <label htmlFor="cargo_presidente_reuniao" className="mt-3">Cargo</label>
                        <input
                            value={stateFormEditarAta.cargo_presidente_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="cargo_presidente_reuniao"
                            className="form-control"
                        />

                        <label htmlFor="cargo_secretaria_reuniao" className="mt-3">Cargo</label>
                        <input
                            value={stateFormEditarAta.cargo_secretaria_reuniao}
                            onChange={(e) => onChange(e.target.name, e.target.value)}
                            name="cargo_secretaria_reuniao"
                            className="form-control"
                        />

                    </div>

                    {dadosAta && dadosAta.tipo_ata === "RETIFICACAO" &&
                    <>
                        <div className="col-12 mt-3">
                            <div className="form-group">
                                <label htmlFor="retificacoes" className="mb-0">Retificações</label>
                                <p><small>Utilize esse campo para registrar as retificações da prestação de contas</small></p>
                                <textarea
                                    rows="3"
                                    placeholder="Escreva seu texto aqui"
                                    value={stateFormEditarAta.retificacoes}
                                    onChange={(e) => onChange(e.target.name, e.target.value)}
                                    name="retificacoes"
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </>
                    }



                    <div className="col-12 mt-3">
                        <div className="form-group">
                            <label htmlFor="comentarios" className="mb-0">Manifestações, Comentários e Justificativas</label>
                            <p><small>Utilize esse campo para registrar possíveis dúvidas, discussões, esclarecimentos aparecidos durante a reunião</small></p>
                            <textarea
                                rows="3"
                                placeholder="Escreva seu texto aqui"
                                value={stateFormEditarAta.comentarios}
                                onChange={(e) => onChange(e.target.name, e.target.value)}
                                name="comentarios"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="parecer_conselho">Como os presentes se posicionam à prestação de contas apresentada?</label>
                            <select
                                value={stateFormEditarAta.parecer_conselho}
                                onChange={(e) => onChange(e.target.name, e.target.value)}
                                name="parecer_conselho"
                                className="form-control"
                            >
                                {tabelas && tabelas.pareceres && tabelas.pareceres.map((tipo) =>
                                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                                )}
                            </select>
                        </div>
                    </div>


                </div>
            </form>
        )

    };
    return (
        <ModalBootstrapEditarAta
            show={show}
            onHide={handleClose}
            titulo="Editar Ata de apresentação"
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={handleClose}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={onSubmitEditarAta}
            segundoBotaoTexto="Salvar"
            segundoBotaoCss="success"
        />
    )
};

export const TextoCopiado = ({show, handleClose}) => {
    return (
        <ModalBootstrap
            show={show}
            onHide={handleClose}
            titulo="Texto copiado com sucesso"
            bodyText='Digite as teclas CTRL + V para "colar" o conteúdo copiado onde desejar'
            primeiroBotaoOnclick={handleClose}
            primeiroBotaoTexto="Fechar"
        />
    )
};

export const EditarMembro = ({show, handleClose, onSubmitEditarMembro, handleChangeEditarMembro, validateFormMembros, stateFormEditarMembro, infosMembroSelecionado, btnSalvarReadOnly}) => {

    const bodyTextarea = () => {
        return (

            <>
                {infosMembroSelecionado &&
                <Formik
                    initialValues={stateFormEditarMembro}
                    validationSchema={YupSignupSchemaMembros}
                    validate={validateFormMembros}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    onSubmit={onSubmitEditarMembro}
                >
                    {props => {
                        const {
                            errors,
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <form method="POST" id="membrosForm" onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="cargo_associacao">Cargo na Associação</label>
                                            <input
                                                readOnly={true}
                                                type="text"
                                                value={props.values.cargo_associacao ? props.values.cargo_associacao : ""}
                                                //onChange={(e) => handleChangeEditarMembro(e.target.name, e.target.value)}
                                                onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }
                                                }
                                                name="cargo_associacao"
                                                className="form-control"
                                            />
                                            {props.errors.cargo_associacao && <span className="span_erro text-danger mt-1"> {props.errors.cargo_associacao}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="representacao">Representação na associação</label>
                                            <select
                                                value={props.values.representacao ? props.values.representacao : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="representacao"
                                                className="form-control"
                                            >
                                                <option value="">Escolha a Representação</option>
                                                <option value="ESTUDANTE">Estudante</option>
                                                <option value='PAI_RESPONSAVEL'>Pai ou responsável</option>
                                                <option value='SERVIDOR'>Servidor</option>
                                            </select>
                                            {props.errors.representacao && <span className="span_erro text-danger mt-1"> {props.errors.representacao}</span>}
                                        </div>
                                    </div>

                                    <div className={`col-12 col-md-6 ${props.values.representacao !== 'SERVIDOR' && props.values.representacao !== 'ESTUDANTE' && 'escondeItem'}`}>
                                        <div className="form-group">
                                            <label htmlFor="codigo_identificacao">{props.values.representacao === 'SERVIDOR' ? "Registro Funcional" : "Código EOL"}</label>
                                            <input
                                                type="text"
                                                value={props.values.codigo_identificacao ? props.values.codigo_identificacao : ""}

                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="codigo_identificacao"
                                                className="form-control"
                                            />
                                            {props.errors.codigo_identificacao && <span className="span_erro text-danger mt-1"> {props.errors.codigo_identificacao}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cargo_associacao">Nome Completo</label>
                                            <input
                                                readOnly={props.values.representacao !== 'PAI_RESPONSAVEL'}
                                                type="text"
                                                value={props.values.nome ? props.values.nome : ""}
                                                onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }
                                                }
                                                name="nome"
                                                className="form-control"
                                            />
                                            {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                        </div>
                                    </div>

                                    <div className={`col-12 col-md-6 ${props.values.representacao !== 'SERVIDOR' && 'escondeItem'}`}>
                                        <div className="form-group">
                                            <label htmlFor="cargo_educacao">Cargo na educação</label>
                                            <input
                                                readOnly={props.values.representacao !== 'PAI_RESPONSAVEL'}
                                                type="text"
                                                value={props.values.cargo_educacao ? props.values.cargo_educacao : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="cargo_educacao"
                                                className="form-control"
                                            />
                                            {(props.values.cargo_educacao === undefined || props.values.cargo_educacao === "") && props.errors.cargo_educacao && <span className="span_erro text-danger mt-1"> {props.errors.cargo_educacao}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="text"
                                                value={props.values.email ? props.values.email : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="email"
                                                className="form-control"
                                                placeholder="Insira seu email se desejar"
                                            />
                                            {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                        </div>
                                    </div>

                                </div>
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={()=>handleClose()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                    <button disabled={btnSalvarReadOnly} type="submit" className="btn btn-success mt-2">Salvar</button>
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
            titulo="Editar membro"
            bodyText={bodyTextarea()}
        />
    )
};

export const SalvarValoresReprogramados = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Todos os dados estão corretos?"
            bodyText="<p><strong>Já verificou se todos os itens cadastrados estão corretos?</strong></p>"
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Não, cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={propriedades.onSalvarTrue}
            segundoBotaoTexto="Sim, salvar"
            segundoBotaoCss="success"
        />
    )
};

export const ChecarDespesaExistente = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Despesa já cadastrada"
            bodyText="<p>Esta despesa já foi cadastrada. Deseja cadastrá-la novamente?</p>"
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Não, cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={propriedades.onSalvarDespesaCadastradaTrue}
            segundoBotaoTexto="Sim, salvar"
            segundoBotaoCss="success"
        />
    )
};

export const AlterarSenhaMeusDados = ({show, handleClose}) => {

    const bodyTextarea = () => {
        return (
            <>
                <div className="row padding-bottom-50">
                    <div className='col'>
                        <FormAlterarSenha
                            textoValidacaoDentroDoForm={false}
                            handleClose={handleClose}
                        />
                    </div>
                    <div className='col'>
                        <TextoValidacaoSenha/>
                    </div>
                </div>
            </>
        )
    };
    return (
        <ModalBootstrapFormMeusDadosSenha
            show={show}
            onHide={handleClose}
            titulo="Editar Senha"
            bodyText={bodyTextarea()}
        />
    )
};

export const AlterarEmailMeusDados = ({show, handleClose}) => {

    const bodyTextarea = () => {
        return (
            <>
                <div className="col-12">
                    <FormAlterarEmail
                        handleClose={handleClose}
                    />
                </div>
            </>
        )
    };
    return (
        <ModalBootstrapFormMeusDadosEmail
            show={show}
            onHide={handleClose}
            titulo="Editar E-mail"
            bodyText={bodyTextarea()}
        />
    )
};

export const ModalConfirmaSalvar = (propriedades) => {
    return (
        <ModalBootstrap
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo={propriedades.titulo}
            bodyText={`<p>${propriedades.texto}</p>`}
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoCss={propriedades.primeiroBotaoCss}
            primeiroBotaoTexto={propriedades.primeiroBotaoTexto ? propriedades.primeiroBotaoTexto : "OK"}
        />
    )
};
