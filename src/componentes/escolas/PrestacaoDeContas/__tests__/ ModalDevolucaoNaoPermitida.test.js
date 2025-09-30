import React from 'react';
import { render } from '@testing-library/react';
import { ModalDevolucaoNaoPermitida } from '../ModalDevolucaoNaoPermitida';

const mockModalBootstrap = jest.fn();

jest.mock('../../../Globais/ModalBootstrap', () => ({
    ModalBootstrap: (props) => {
        mockModalBootstrap(props);
        return null;
    },
}));

const mensagemPadrao = 'O saldo bancário da conta informada foi modificado e não é permitido devolução. Favor retornar o saldo bancário para o valor original indicado na entrega da prestação de contas.';

const renderModal = (props = {}) => {
    const handleClose = props.handleClose || jest.fn();
    render(
        <ModalDevolucaoNaoPermitida
            show
            handleClose={handleClose}
            {...props}
        />
    );

    const modalProps = mockModalBootstrap.mock.calls[0][0];
    return { modalProps, handleClose };
};

describe('ModalDevolucaoNaoPermitida', () => {
    beforeEach(() => {
        mockModalBootstrap.mockClear();
    });

    it('exibe a mensagem padrão quando nenhuma mensagem personalizada é informada', () => {
        const { modalProps } = renderModal();

        expect(modalProps.bodyText).toBe(`<p>${mensagemPadrao}</p>`);
    });

    it('envolve mensagens simples em uma tag <p>', () => {
        const mensagem = 'Saldo alterado para a conta Corrente.';

        const { modalProps } = renderModal({ mensagem });

        expect(modalProps.bodyText).toBe(`<p>${mensagem}</p>`);
    });

    it('mantém mensagens com HTML sem adicionar marcação extra', () => {
        const mensagemHtml = '   <p><strong>Aviso:</strong> saldo divergente.</p>   ';
        const mensagemHtmlEsperada = '<p><strong>Aviso:</strong> saldo divergente.</p>';

        const { modalProps } = renderModal({ mensagem: mensagemHtml });

        expect(modalProps.bodyText).toBe(mensagemHtmlEsperada);
    });

    it('encaminha onHide para o ModalBootstrap', () => {
        const handleClose = jest.fn();

        const { modalProps } = renderModal({ handleClose });

        modalProps.onHide();
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('dispara handleClose ao confirmar e mantém a configuração padrão do botão', () => {
        const handleClose = jest.fn();

        const { modalProps } = renderModal({ handleClose, mensagem: 'Texto' });

        modalProps.primeiroBotaoOnclick();
        expect(handleClose).toHaveBeenCalledTimes(1);
        expect(modalProps.primeiroBotaoTexto).toBe('Confirmar');
        expect(modalProps.primeiroBotaoCss).toBe('success');
    });
});
