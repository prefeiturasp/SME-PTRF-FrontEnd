import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalVisualizarPdf } from '../index';
import '@testing-library/jest-dom';

jest.mock('react-bootstrap', () => {
  const MockModal = ({ show, onHide, children, className, dialogClassName }) => (
    show ? (
      <div className={className} data-dialog-class={dialogClassName}>
        {children}
      </div>
    ) : null
  );
  
  MockModal.Header = ({ children }) => <div data-testid="modal-header">{children}</div>;
  MockModal.Title = ({ children }) => <h5>{children}</h5>;
  MockModal.Body = ({ children }) => <div data-testid="modal-body">{children}</div>;
  
  return {
    Modal: MockModal
  };
});

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid="icon">{icon.iconName}</span>
}));

describe('ModalVisualizarPdf', () => {
  const mockOnHide = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o modal quando show é true', () => {
    render(<ModalVisualizarPdf show={true} onHide={mockOnHide} url="test.pdf" />);
    
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('modal-body')).toBeInTheDocument();
  });

  it('não deve renderizar o modal quando show é false', () => {
    const { container } = render(<ModalVisualizarPdf show={false} onHide={mockOnHide} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('deve exibir título padrão quando não fornecido', () => {
    render(<ModalVisualizarPdf show={true} onHide={mockOnHide} url="test.pdf" />);
    
    expect(screen.getByText('Visualizar PDF')).toBeInTheDocument();
  });

  it('deve exibir título customizado quando fornecido', () => {
    render(<ModalVisualizarPdf show={true} onHide={mockOnHide} url="test.pdf" titulo="Meu PDF" />);
    
    expect(screen.getByText('Meu PDF')).toBeInTheDocument();
  });

  it('deve renderizar iframe quando url é fornecida', () => {
    render(<ModalVisualizarPdf show={true} onHide={mockOnHide} url="test.pdf" />);
    
    const iframe = screen.getByTitle('PDF');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'test.pdf');
  });

  it('deve exibir mensagem de erro quando url não é fornecida', () => {
    render(<ModalVisualizarPdf show={true} onHide={mockOnHide} />);
    
    expect(screen.getByText('Não foi possível carregar o PDF.')).toBeInTheDocument();
  });

  it('deve usar iframeTitle customizado quando fornecido', () => {
    render(<ModalVisualizarPdf show={true} onHide={mockOnHide} url="test.pdf" iframeTitle="Documento PDF" />);
    
    expect(screen.getByTitle('Documento PDF')).toBeInTheDocument();
  });
});

