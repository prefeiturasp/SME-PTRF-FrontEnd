import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
    ModalInfoGeracaoDocumentoPrevia,
    ModalInfoGeracaoDocumentoFinal,
    ModalConfirmaGeracaoFinal,
    ModalInfoPendenciasGeracaoFinal
} from '../ModalInfoGeracaoDocumento';

// Mock do componente ModalFormBodyText
jest.mock('../../../../../../Globais/ModalBootstrap', () => ({
    ModalFormBodyText: ({ show, onHide, titulo, bodyText }) => (
        show ? (
            <div data-testid="modal-form-body-text">
                <div data-testid="modal-title">{titulo}</div>
                <div data-testid="modal-body">{bodyText}</div>
                <button onClick={onHide} data-testid="modal-hide-button">Hide</button>
            </div>
        ) : null
    )
}));

describe('ModalInfoGeracaoDocumentoPrevia', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o modal quando open é true', () => {
        render(<ModalInfoGeracaoDocumentoPrevia open={true} onClose={mockOnClose} />);
        
        expect(screen.getByTestId('modal-form-body-text')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Documento prévio sendo gerado');
    });

    it('não deve renderizar o modal quando open é false', () => {
        render(<ModalInfoGeracaoDocumentoPrevia open={false} onClose={mockOnClose} />);
        
        expect(screen.queryByTestId('modal-form-body-text')).not.toBeInTheDocument();
    });

    it('deve exibir o texto padrão de informação', () => {
        render(<ModalInfoGeracaoDocumentoPrevia open={true} onClose={mockOnClose} />);
        
        expect(screen.getByText(/O documento está sendo gerado/i)).toBeInTheDocument();
        expect(screen.getByText(/um botão de download ficará disponível/i)).toBeInTheDocument();
    });

    it('deve chamar onClose ao clicar no botão Fechar', () => {
        render(<ModalInfoGeracaoDocumentoPrevia open={true} onClose={mockOnClose} />);
        
        const fecharButton = screen.getByRole('button', { name: /fechar/i });
        fireEvent.click(fecharButton);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar o botão Fechar com as classes corretas', () => {
        render(<ModalInfoGeracaoDocumentoPrevia open={true} onClose={mockOnClose} />);
        
        const fecharButton = screen.getByRole('button', { name: /fechar/i });
        expect(fecharButton).toHaveClass('btn', 'btn-outline-success', 'btn-sm');
    });
});

describe('ModalInfoGeracaoDocumentoFinal', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o modal quando open é true', () => {
        render(<ModalInfoGeracaoDocumentoFinal open={true} onClose={mockOnClose} />);
        
        expect(screen.getByTestId('modal-form-body-text')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Documento final sendo gerado');
    });

    it('não deve renderizar o modal quando open é false', () => {
        render(<ModalInfoGeracaoDocumentoFinal open={false} onClose={mockOnClose} />);
        
        expect(screen.queryByTestId('modal-form-body-text')).not.toBeInTheDocument();
    });

    it('deve exibir o mesmo texto padrão de informação', () => {
        render(<ModalInfoGeracaoDocumentoFinal open={true} onClose={mockOnClose} />);
        
        expect(screen.getByText(/O documento está sendo gerado/i)).toBeInTheDocument();
    });

    it('deve chamar onClose ao clicar no botão Fechar', () => {
        render(<ModalInfoGeracaoDocumentoFinal open={true} onClose={mockOnClose} />);
        
        const fecharButton = screen.getByRole('button', { name: /fechar/i });
        fireEvent.click(fecharButton);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});

describe('ModalConfirmaGeracaoFinal', () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o modal quando open é true', () => {
        render(
            <ModalConfirmaGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                onConfirm={mockOnConfirm} 
            />
        );
        
        expect(screen.getByTestId('modal-form-body-text')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Conclusão do PAA');
    });

    it('não deve renderizar o modal quando open é false', () => {
        render(
            <ModalConfirmaGeracaoFinal 
                open={false} 
                onClose={mockOnClose} 
                onConfirm={mockOnConfirm} 
            />
        );
        
        expect(screen.queryByTestId('modal-form-body-text')).not.toBeInTheDocument();
    });

    it('deve exibir a mensagem de aviso sobre conclusão', () => {
        render(
            <ModalConfirmaGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                onConfirm={mockOnConfirm} 
            />
        );
        
        expect(screen.getByText(/Após a conclusão do PAA, não será possível realizar edições/i)).toBeInTheDocument();
        expect(screen.getByText(/será preciso efetuar uma retificação/i)).toBeInTheDocument();
    });

    it('deve chamar onClose ao clicar no botão Cancelar', () => {
        render(
            <ModalConfirmaGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                onConfirm={mockOnConfirm} 
            />
        );
        
        const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelarButton);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('deve chamar onConfirm ao clicar no botão Continuar', () => {
        render(
            <ModalConfirmaGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                onConfirm={mockOnConfirm} 
            />
        );
        
        const continuarButton = screen.getByRole('button', { name: /continuar/i });
        fireEvent.click(continuarButton);
        
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('deve renderizar os botões com as classes corretas', () => {
        render(
            <ModalConfirmaGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                onConfirm={mockOnConfirm} 
            />
        );
        
        const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
        const continuarButton = screen.getByRole('button', { name: /continuar/i });
        
        expect(cancelarButton).toHaveClass('btn', 'btn-outline-success', 'btn-sm');
        expect(continuarButton).toHaveClass('btn', 'btn-success', 'btn-sm');
    });
});

describe('ModalInfoPendenciasGeracaoFinal', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o modal quando open é true', () => {
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias="" 
            />
        );
        
        expect(screen.getByTestId('modal-form-body-text')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Pendências para geração do PAA');
    });

    it('não deve renderizar o modal quando open é false', () => {
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={false} 
                onClose={mockOnClose} 
                pendencias="" 
            />
        );
        
        expect(screen.queryByTestId('modal-form-body-text')).not.toBeInTheDocument();
    });

    it('deve exibir mensagem sobre preenchimento de seções', () => {
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias="" 
            />
        );
        
        expect(screen.getByText(/É necessário preenchimento nas seguintes seções/i)).toBeInTheDocument();
    });

    it('deve renderizar pendências de Prioridades corretamente', () => {
        const pendencias = 'Prioridades sem ação';
        
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias={pendencias} 
            />
        );
        
        expect(screen.getByText('Prioridades')).toBeInTheDocument();
    });

    it('deve renderizar pendências de introdução corretamente', () => {
        const pendencias = 'Falta introdução';
        
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias={pendencias} 
            />
        );
        
        expect(screen.getByText('Introdução')).toBeInTheDocument();
    });

    it('deve renderizar pendências de objetivos corretamente', () => {
        const pendencias = 'Falta objetivo';
        
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias={pendencias} 
            />
        );
        
        expect(screen.getByText('Objetivos')).toBeInTheDocument();
    });

    it('deve renderizar pendências de conclusão corretamente', () => {
        const pendencias = 'Falta conclusão';
        
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias={pendencias} 
            />
        );
        
        expect(screen.getByText('Conclusão')).toBeInTheDocument();
    });

    it('deve renderizar múltiplas pendências separadas por quebra de linha', () => {
        const pendencias = 'Prioridades sem ação\nFalta introdução\nFalta objetivo';
        
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias={pendencias} 
            />
        );
        
        expect(screen.getByText('Prioridades')).toBeInTheDocument();
        expect(screen.getByText('Introdução')).toBeInTheDocument();
        expect(screen.getByText('Objetivos')).toBeInTheDocument();
    });

    it('deve renderizar lista vazia quando pendencias é string vazia', () => {
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias="" 
            />
        );
        
        const listItems = screen.queryAllByRole('listitem');
        expect(listItems).toHaveLength(1);
        expect(listItems[0]).toHaveTextContent('');
    });

    it('deve chamar onClose ao clicar no botão Ok', () => {
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias="Falta introdução" 
            />
        );
        
        const okButton = screen.getByRole('button', { name: /ok/i });
        fireEvent.click(okButton);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar o botão Ok com as classes corretas', () => {
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias="" 
            />
        );
        
        const okButton = screen.getByRole('button', { name: /ok/i });
        expect(okButton).toHaveClass('btn', 'btn-success', 'btn-sm');
    });

    it('deve lidar com pendencias undefined', () => {
        render(
            <ModalInfoPendenciasGeracaoFinal 
                open={true} 
                onClose={mockOnClose} 
                pendencias={undefined} 
            />
        );
        
        const listItems = screen.queryAllByRole('listitem');
        expect(listItems).toHaveLength(1);
    });
});
