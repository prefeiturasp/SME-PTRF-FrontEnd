import { render, screen, fireEvent } from '@testing-library/react';
import { ModalSalvarDataSaldoExtrato } from '../ModalSalvarDataSaldoExtrato';
// import { ModalBootstrap } from '../../../Globais/ModalBootstrap';

// jest.mock('../../../Globais/ModalBootstrap'); // já está mockado acima

// jest.mock('../../../Globais/ModalBootstrap', () => ({
//   ModalBootstrap: jest.fn((props) => (
//     <div data-testid="modal-bootstrap">
//       <h2>{props.titulo}</h2>
//       <div dangerouslySetInnerHTML={{ __html: props.bodyText }} />
//       <button onClick={props.segundoBotaoOnclick} className={props.segundoBotaoCss}>
//         {props.segundoBotaoTexto}
//       </button>
//       <button onClick={props.primeiroBotaoOnclick} className={props.primeiroBotaoCss}>
//         {props.primeiroBotaoTexto}
//       </button>
//     </div>
//   )),
// }));

describe('ModalSalvarDataSaldoExtrato', () => {
  const defaultProps = {
    show: true,
    handleClose: jest.fn(),
    titulo: 'Salvar Data',
    texto: '<p>Deseja salvar a data informada?</p>',
    primeiroBotaoOnclick: jest.fn(),
    primeiroBotaoTexto: 'Salvar',
    primeiroBotaoCss: 'btn-success',
    segundoBotaoOnclick: jest.fn(),
    segundoBotaoTexto: 'Cancelar',
    segundoBotaoCss: 'btn-outline-secondary',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o modal com título e texto corretos', () => {
    render(<ModalSalvarDataSaldoExtrato {...defaultProps} />);

    expect(screen.getByText('Salvar Data')).toBeInTheDocument();
    expect(screen.getByText(/Deseja salvar a data/i)).toBeInTheDocument();
  });

  it('chama o callback do primeiro botão', () => {
    render(<ModalSalvarDataSaldoExtrato {...defaultProps} />);

    const botaoSalvar = screen.getByText('Salvar');
    fireEvent.click(botaoSalvar);

    expect(defaultProps.primeiroBotaoOnclick).toHaveBeenCalled();
  });

  it('chama o callback do segundo botão', () => {
    render(<ModalSalvarDataSaldoExtrato {...defaultProps} />);

    const botaoCancelar = screen.getByText('Cancelar');
    fireEvent.click(botaoCancelar);

    expect(defaultProps.segundoBotaoOnclick).toHaveBeenCalled();
  });

});
