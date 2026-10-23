import { render, screen, fireEvent } from '@testing-library/react';
import { ModalAlertaPagina } from '../ModalAlertaPagina';
import { openModal, closeModal } from '../../../../store/reducers/componentes/Globais/Modal/actions';

jest.mock('../../../../store/reducers/componentes/Globais/Modal/actions', () => ({
    openModal: jest.fn(),
    closeModal: jest.fn(),
}));

describe('ModalAlertaPagina', () => {
    const dispatch = jest.fn();

    // O react-scripts usa resetMocks: true, que remove as implementações antes de cada teste.
    beforeEach(() => {
        openModal.mockImplementation((config) => config);
        closeModal.mockImplementation(() => ({ type: 'CLOSE' }));
        dispatch.mockImplementation((acao) => acao);
    });

    it('abre modal persistente (sem fechar por clique fora ou ESC)', () => {
        ModalAlertaPagina({ dispatch, textoHtml: '<p>Aviso</p>' });

        expect(openModal).toHaveBeenCalledWith(
            expect.objectContaining({ backdrop: 'static', keyboard: false }),
        );
    });

    it('sanitiza o HTML do texto', () => {
        const { children } = ModalAlertaPagina({
            dispatch,
            textoHtml: '<p>Seguro</p><script>alert(1)</script>',
        });

        const { container } = render(children);

        expect(screen.getByText('Seguro')).toBeInTheDocument();
        expect(container.querySelector('script')).toBeNull();
    });

    it('fecha somente ao clicar em Fechar e chama onFechar', () => {
        const onFechar = jest.fn();
        const { children } = ModalAlertaPagina({ dispatch, textoHtml: '<p>x</p>', onFechar });
        render(children);

        fireEvent.click(screen.getByText('Entendi'));

        expect(onFechar).toHaveBeenCalledTimes(1);
        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    it('não quebra sem texto nem onFechar', () => {
        const { children } = ModalAlertaPagina({ dispatch });
        render(children);

        expect(() => fireEvent.click(screen.getByText('Entendi'))).not.toThrow();
    });
});
