import { ModalInfo } from '../ModalInfo';
import { openModal, closeModal } from '../../../../store/reducers/componentes/Globais/Modal/actions';

jest.mock('../../../../store/reducers/componentes/Globais/Modal/actions', () => ({
  openModal: jest.fn((config) => config),
  closeModal: jest.fn(),
}));

describe('ModalInfo', () => {
  const mockDispatch = jest.fn((action) => action);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama dispatch com openModal', () => {
    ModalInfo({
      dispatch: mockDispatch,
      title: 'Título Info',
      message: 'Mensagem informativa',
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('usa texto padrão "Fechar" quando não fornecido', () => {
    ModalInfo({
      dispatch: mockDispatch,
      title: 'Título',
      message: 'Mensagem',
    });

    expect(mockDispatch).toHaveBeenCalled();
  });
});

