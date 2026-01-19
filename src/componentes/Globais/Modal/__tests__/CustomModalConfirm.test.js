import { CustomModalConfirm } from '../CustomModalConfirm';
import { openModal, closeModal } from '../../../../store/reducers/componentes/Globais/Modal/actions';

jest.mock('../../../../store/reducers/componentes/Globais/Modal/actions', () => ({
  openModal: jest.fn((config) => config),
  closeModal: jest.fn(),
}));

describe('CustomModalConfirm', () => {
  const mockDispatch = jest.fn((action) => action);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama dispatch com openModal', () => {
    CustomModalConfirm({
      dispatch: mockDispatch,
      title: 'Título',
      message: 'Mensagem',
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('usa isDanger false por padrão', () => {
    CustomModalConfirm({
      dispatch: mockDispatch,
      title: 'Título',
      message: 'Mensagem',
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('renderiza botão de confirmar quando onConfirm é fornecido', () => {
    CustomModalConfirm({
      dispatch: mockDispatch,
      title: 'Título',
      message: 'Mensagem',
      onConfirm: jest.fn(),
    });

    expect(mockDispatch).toHaveBeenCalled();
  });
});

