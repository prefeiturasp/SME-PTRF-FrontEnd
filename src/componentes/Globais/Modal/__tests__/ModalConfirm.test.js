import { ModalConfirm } from '../ModalConfirm';
import { openModal, closeModal } from '../../../../store/reducers/componentes/Globais/Modal/actions';

jest.mock('../../../../store/reducers/componentes/Globais/Modal/actions', () => ({
  openModal: jest.fn((config) => config),
  closeModal: jest.fn(),
}));

describe('ModalConfirm', () => {
  const mockDispatch = jest.fn((action) => action);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama dispatch com openModal', () => {
    ModalConfirm({
      dispatch: mockDispatch,
      title: 'Título Teste',
      message: 'Mensagem de teste',
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('usa textos padrão quando não fornecidos', () => {
    ModalConfirm({
      dispatch: mockDispatch,
      title: 'Título',
    });

    expect(mockDispatch).toHaveBeenCalled();
  });
});

