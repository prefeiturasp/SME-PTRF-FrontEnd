import { render, screen, fireEvent } from '@testing-library/react';
import { ModalPreviaSendoGerada } from '../ModalGerarPreviaSendogerada';

jest.mock('../../../Globais/ModalBootstrap', () => ({
  ModalBootstrap: ({ show, onHide, titulo, bodyText, primeiroBotaoOnclick, primeiroBotaoTexto, dataQa }) => (
    <div data-testid="modal-bootstrap" data-qa={dataQa}>
      <h2>{titulo}</h2>
      <div dangerouslySetInnerHTML={{ __html: bodyText }} />
      <button onClick={onHide}>Fechar</button>
      <button onClick={primeiroBotaoOnclick} data-testid='fechar-primeiro-botao'>{primeiroBotaoTexto}</button>
    </div>
  ),
}));

describe('ModalPreviaSendoGerada', () => {
  const defaultProps = {
    show: true,
    primeiroBotaoTexto: 'Fechar',
    handleClose: jest.fn(),
    primeiroBotaoOnClick: jest.fn(),
    dataQa: 'modal-previa-gerada',
  };

  it('renderiza título e conteúdo do corpo corretamente', () => {
    render(<ModalPreviaSendoGerada {...defaultProps} />);

    expect(screen.getByText('Documento prévio sendo gerado')).toBeInTheDocument();
    expect(screen.getByText(/O documento está sendo gerado/i)).toBeInTheDocument();
  });

  it('chama handleClose ao clicar no botão "Fechar"', () => {
    render(<ModalPreviaSendoGerada {...defaultProps} />);

    fireEvent.click(screen.getAllByText('Fechar')[0]);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  it('chama primeiroBotaoOnClick ao clicar no botão de ação principal', () => {
    render(<ModalPreviaSendoGerada {...defaultProps} />);
    const botaoFechar = screen.getByTestId('fechar-primeiro-botao');
    fireEvent.click(botaoFechar);
    expect(defaultProps.primeiroBotaoOnClick).toHaveBeenCalled();
  });

  it('passa data-qa corretamente', () => {
    render(<ModalPreviaSendoGerada {...defaultProps} />);
    expect(screen.getByTestId('modal-bootstrap')).toHaveAttribute('data-qa', 'modal-previa-gerada');
  });
});
