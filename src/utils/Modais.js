import React from "react";
import {
    ModalBootstrap,
    ModalBootstrapReverConciliacao,
    ModalBootstrapSaldoInsuficiente,
    ModalBootstrapSaldoInsuficienteDaconta,
    ModalBootstrapEditarAta,
    ModalBootstrapForm
} from "../componentes/ModalBootstrap";
import {DatePickerField} from "../componentes/DatePickerField";

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
            titulo="Deseja cancelar a inclusão de Receita?"
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
            titulo="Deseja excluir esta Receita?"
            bodyText="<p>Tem certeza que deseja excluir esta Receita? A ação não poderá ser desfeita.</p>"
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
            titulo="Deseja salvar a conciliação?"
            bodyText=""
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
                    permitirá que alterações sejam feitas nos dados da Associação e cadastro de receitas e
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
            bodyText="Este período está fechado, tente novamente."
            primeiroBotaoOnclick={propriedades.handleClose}
            primeiroBotaoTexto="Fechar"
        />
    )
};

export const EditarAta = ({show, handleClose, onSubmitEditarAta, onChange, stateFormEditarAta, tabelas}) => {
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


                    <div className="col-12 mt-3">
                        <div className="form-group">
                            <label htmlFor="comentarios" className="mb-0">Manifestações, Comentários e
                                Justificativas</label>
                            <p><small>Utilize esse campo para registrar possíveis dúvidas, discussões, esclarecimentos
                                aparecidos durante a reunião</small></p>
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
                {/*row*/}
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

export const EditarMembro = ({show, handleClose, onSubmitEditarMembro, handleChangeEditarMembro, stateFormEditarMembro, tabelas}) => {

    const bodyTextarea = () => {
        return (
            <form>
                <div className='row'>
                    <div className="col-12">
                        <div className="form-group">
                            <label htmlFor="cargo_associacao">Cargo na Associação</label>
                            <input
                                readOnly={true}
                                type="text"
                                value={stateFormEditarMembro.cargo_associacao}
                                onChange={(e) => handleChangeEditarMembro(e.target.name, e.target.value)}
                                name="cargo_associacao"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="representacao_associacao">Representação na associação</label>
                            <select
                                value={stateFormEditarMembro.representacao_associacao}
                                onChange={(e) => handleChangeEditarMembro(e.target.name, e.target.value)}
                                name="representacao_associacao"
                                className="form-control"
                            >
                                <option value="estudante">Estudante</option>
                                <option value='responsavel'>Pai ou responsável</option>
                                <option value='servidor'>Servidor</option>
                            </select>
                        </div>
                    </div>

                    <div className={`col-12 col-md-6 ${stateFormEditarMembro.representacao_associacao !== 'servidor' && 'escondeItem'}`}>
                        <div className="form-group">
                            <label htmlFor="rf">Registro Funcional</label>
                            <input
                                type="text"
                                value={stateFormEditarMembro.rf}
                                onChange={(e) => handleChangeEditarMembro(e.target.name, e.target.value)}
                                name="rf"
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="cargo_associacao">Nome Completo</label>
                            <input
                                readOnly={stateFormEditarMembro.representacao_associacao !== 'responsavel'}
                                type="text"
                                value={stateFormEditarMembro.nome_completo}
                                onChange={(e) => handleChangeEditarMembro(e.target.name, e.target.value)}
                                name="nome_completo"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className={`col-12 col-md-6 ${stateFormEditarMembro.representacao_associacao !== 'servidor' && 'escondeItem'}`}>
                        <div className="form-group">
                            <label htmlFor="cargo_educacao">Cargo na educação</label>
                            <select
                                value={stateFormEditarMembro.cargo_educacao}
                                onChange={(e) => handleChangeEditarMembro(e.target.name, e.target.value)}
                                name="cargo_educacao"
                                className="form-control"
                            >
                                <option value="coordenador">Coordenador</option>
                                <option value='presidente'>Presidente</option>
                            </select>
                        </div>
                    </div>

                </div>

            </form>
        )

    };
    return (
        <ModalBootstrapForm
            show={show}
            onHide={handleClose}
            titulo="Editar membro"
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={handleClose}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={onSubmitEditarMembro}
            segundoBotaoTexto="Salvar"
            segundoBotaoCss="success"
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
