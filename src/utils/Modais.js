import React from "react";
import {
    ModalBootstrap,
    ModalBootstrapReverConciliacao,
    ModalBootstrapSaldoInsuficiente,
    ModalBootstrapSaldoInsuficienteDaconta
} from "../componentes/ModalBootstrap";

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
}

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
}

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
}

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
}
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
}

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
}

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
}

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
}


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
}

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
}

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
}

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
}

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
                    type='text'
                    className="form-control"
                />
            </form>
        )

    }
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
}

export const SaldoInsuficiente = (propriedades) => {

    const listaDeSaldosInsuficientes = () => {

        return (
            <>
                <p>Não há saldo disponível para a despesa cadastrada, nas ações/aplicações abaixo. Você deseja cadastrá-la mesmo assim?</p>
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
    }
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
}

export const SaldoInsuficienteConta = (propriedades) => {

    console.log("SaldoInsuficienteConta", propriedades)

    const listaDeSaldosInsuficientes = () => {

        return (
            <>
                <p>Não há saldo disponível para a despesa cadastrada na conta selecionada. {propriedades.saldosInsuficientesDaConta.aceitar_lancamento ? "Deseja salvar assim mesmo?" : ""}</p>
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
    }
    return (
        <ModalBootstrapSaldoInsuficienteDaconta
            show={propriedades.show}
            onHide={propriedades.handleClose}
            titulo="Saldo da Conta Insuficiente"
            bodyText={listaDeSaldosInsuficientes()}
            aceitarLancamento={false}
            //aceitarLancamento={propriedades.saldosInsuficientesDaConta.aceitar_lancamento}
            primeiroBotaoOnclick={propriedades.onSaldoInsuficienteContaTrue}
            primeiroBotaoTexto="OK"
            segundoBotaoOnclick={propriedades.handleClose}
            segundoBotaoTexto="Fechar"
        />
    )
}

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
}
