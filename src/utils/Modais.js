import React from "react";
import {
    ModalBootstrap,
    ModalBootstrapReverConciliacao,
    ModalBootstrapSaldoInsuficiente,
    ModalBootstrapSaldoInsuficienteDaconta,
    ModalBootstrapFormMembros,
    ModalBootstrapFormMeusDadosSenha,
    ModalBootstrapFormMeusDadosEmail
} from "../componentes/Globais/ModalBootstrap";
import {FormAlterarSenha} from "../componentes/Globais/EdicaoDeSenha/FormAlterarSenha";
import {TextoValidacaoSenha} from "../componentes/Globais/MedidorForcaSenha/textoValidacaoSenha";
import {FormAlterarEmail} from "../componentes/Globais/FormAlterarEmail";
import {Formik} from 'formik';
import {YupSignupSchemaMembros} from "./ValidacoesAdicionaisFormularios";
import {visoesService} from "../services/visoes.service";

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
            bodyText="Este período está fechado. Para inclusão ou edição de lançamentos (créditos ou despesas) é necessário reabrir o processo de prestação de contas. Se for esse o caso, por favor, entre em contato com sua Diretoria Regional de Educação - DRE."
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="success"
            // segundoBotaoOnclick={() => {window.location.assign("/prestacao-de-contas")}}
            // segundoBotaoTexto="Sim"
            // segundoBotaoCss="success"
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

export const EditarMembro = ({visoesService, show, handleClose, onSubmitEditarMembro, handleChangeEditarMembro, validateFormMembros, stateFormEditarMembro, infosMembroSelecionado, btnSalvarReadOnly, usuarios}) => {

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
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
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
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
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
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
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
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
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
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
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

                                    <div className='col-12'>
                                        <div className='form-group'>
                                            <label htmlFor="usuario">Usuário</label>
                                            <select
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
                                                value={props.values.usuario ? props.values.usuario : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="usuario"
                                                className="form-control"
                                            >
                                                <option value="">Escolha seu usuário</option>
                                                {usuarios && usuarios.length > 0 && usuarios.map(usuario=>
                                                    <option key={usuario.id} value={usuario.id}>{usuario.name}</option>
                                                )}

                                            </select>
                                            {props.errors.representacao && <span className="span_erro text-danger mt-1"> {props.errors.representacao}</span>}
                                        </div>
                                    </div>

                                </div>
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={()=>handleClose()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                    <button disabled={btnSalvarReadOnly || !visoesService.getPermissoes(['change_associacao'])} type="submit" className="btn btn-success mt-2">Salvar</button>
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
