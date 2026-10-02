import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalConcluirPcNaoApresentada } from '../ModalConcluirPcNaoApresentada';

let mockCapturedModalBootstrapProps = null;
jest.mock('../../../../../Globais/ModalBootstrap', () => ({
    ModalBootstrap: (props) => {
        mockCapturedModalBootstrapProps = props;
        return <div data-testid="modal-bootstrap-mock" />;
    },
}));

describe('ModalConcluirPcNaoApresentada', () => {
    beforeEach(() => {
        mockCapturedModalBootstrapProps = null;
    });

    it('repassa todas as props recebidas para o ModalBootstrap com o mapeamento correto', () => {
        const handleClose = jest.fn();
        const onConcluirPcNaoApresentada = jest.fn();

        render(
            <ModalConcluirPcNaoApresentada
                show={true}
                handleClose={handleClose}
                onConcluirPcNaoApresentada={onConcluirPcNaoApresentada}
                titulo="Concluir análise"
                texto="<p>texto</p>"
                primeiroBotaoTexto="Cancelar"
                primeiroBotaoCss="outline-success"
                segundoBotaoCss="success"
                segundoBotaoTexto="Concluir análise"
            />
        );

        expect(mockCapturedModalBootstrapProps.show).toBe(true);
        expect(mockCapturedModalBootstrapProps.onHide).toBe(handleClose);
        expect(mockCapturedModalBootstrapProps.titulo).toBe('Concluir análise');
        expect(mockCapturedModalBootstrapProps.bodyText).toBe('<p>texto</p>');
        expect(mockCapturedModalBootstrapProps.primeiroBotaoOnclick).toBe(handleClose);
        expect(mockCapturedModalBootstrapProps.primeiroBotaoTexto).toBe('Cancelar');
        expect(mockCapturedModalBootstrapProps.primeiroBotaoCss).toBe('outline-success');
        expect(mockCapturedModalBootstrapProps.segundoBotaoOnclick).toBe(onConcluirPcNaoApresentada);
        expect(mockCapturedModalBootstrapProps.segundoBotaoCss).toBe('success');
        expect(mockCapturedModalBootstrapProps.segundoBotaoTexto).toBe('Concluir análise');
        expect(mockCapturedModalBootstrapProps.dataQa).toBe('modal-concluir-pc-nao-apresentada');
    });

    it('repassa show=false quando o modal não deve ser exibido', () => {
        render(
            <ModalConcluirPcNaoApresentada
                show={false}
                handleClose={jest.fn()}
                onConcluirPcNaoApresentada={jest.fn()}
            />
        );

        expect(mockCapturedModalBootstrapProps.show).toBe(false);
    });
});
