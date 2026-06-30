import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';

let capturedFormProps = null;
let capturedOnConfirm = null;

jest.mock('../ProcessoSeiPrestacaoDeContaForm', () => ({
  ProcessoSeiPrestacaoDeContaForm: (props) => {
    capturedFormProps = props;
    if (!props.show) return null;
    return (
      <div data-testid="form">
        <button data-testid="form-submit" onClick={() => props.onSubmit(props.initialValues)}>Salvar</button>
        <button data-testid="form-close" onClick={props.handleClose}>Fechar</button>
        <button data-testid="form-change-ano" onClick={() => props.handleChange('ano', '2024')}>Change Ano</button>
        <button data-testid="form-change-numero" onClick={() => props.handleChange('numero_processo', '99999')}>Change Numero</button>
        <button data-testid="form-change-periodos" onClick={() => props.handleChangeSelectPeriodos(['p1', 'p2'])}>Change Periodos</button>
        <button data-testid="form-validate" onClick={() => props.validateForm()}>Validate</button>
      </div>
    );
  },
}));

jest.mock('../ConfirmaDeleteProcessoDialog', () => ({
  ConfirmaDeleteProcesso: (props) =>
    props.show ? (
      <div data-testid="confirm-delete">
        <button data-testid="btn-confirm-delete" onClick={props.onConfirmDelete}>Confirmar</button>
        <button data-testid="btn-cancel-delete" onClick={props.onCancelDelete}>Cancelar</button>
      </div>
    ) : null,
}));

jest.mock('../../../../../Globais/Modal/ModalConfirm', () => ({
  ModalConfirm: jest.fn(),
}));

jest.mock('../../../../../Globais/ToastCustom', () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock('../../../../../Globais/UI/Button', () => ({
  EditIconButton: ({ onClick }) => (
    <button data-testid="edit-btn" onClick={onClick} aria-label="Editar">Edit</button>
  ),
}));

jest.mock('../../../../../Globais/Mensagens/MsgImgLadoDireito', () => ({
  MsgImgLadoDireito: ({ texto }) => <div data-testid="msg-empty">{texto}</div>,
}));

jest.mock('antd', () => ({
  Button: ({ onClick, disabled, children }) => (
    <button data-testid="delete-btn" onClick={onClick} disabled={disabled}>{children}</button>
  ),
  Tooltip: ({ children }) => <>{children}</>,
}));

jest.mock('@ant-design/icons', () => ({
  DeleteFilled: () => <span>Delete</span>,
}));

jest.mock('primereact/datatable', () => {
  const React = require('react');
  return {
    DataTable: ({ value, children }) => {
      const cols = React.Children.toArray(children);
      return (
        <div data-testid="table">
          {value &&
            value.map((item) => (
              <div key={item.uuid} data-testid={`row-${item.uuid}`}>
                {cols.map((col, i) =>
                  col.props && col.props.body ? (
                    <div key={i}>{col.props.body(item)}</div>
                  ) : (
                    <span key={i}>{item[col.props && col.props.field]}</span>
                  )
                )}
              </div>
            ))}
        </div>
      );
    },
  };
});

jest.mock('primereact/column', () => ({ Column: () => null }));

jest.mock('../../../../../../services/dres/Associacoes.service');
jest.mock('../../../../../../services/dres/ProcessosAssociacao.service');
jest.mock('../../../../../../services/visoes.service');
jest.mock('../../../../../../services/storages/RecursoSelecionado.storage.service', () => ({
  recursoSelecionadoStorageService: {},
}));

/* eslint-disable-next-line import/first */
import { ProcessosSeiPrestacaoDeContas } from '../ProcessosSeiPrestacaoDeContas';

const mockStore = {
  getState: () => ({}),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
};

const PROCESS = {
  uuid: 'p1',
  numero_processo: '23076.000001/2024-01',
  ano: '2024',
  periodos: [{ uuid: 'per-1', referencia: '2024.1' }],
  permite_exclusao: true,
  tooltip_exclusao: '',
};

const globalProps = {
  dadosDaAssociacao: {
    dados_da_associacao: {
      uuid: 'assoc-1',
      recursos_da_associacao: [{ uuid: 'r1', nome: 'Recurso 1' }],
    },
  },
  recurso_uuid: 'r1',
  recurso_nome: 'Recurso 1',
};

const getServices = () => {
  const { getProcessosAssociacao } = require('../../../../../../services/dres/Associacoes.service');
  const {
    createProcessoAssociacao,
    deleteProcessoAssociacao,
    getPeriodosDisponiveis,
    updateProcessoAssociacao,
  } = require('../../../../../../services/dres/ProcessosAssociacao.service');
  const { visoesService } = require('../../../../../../services/visoes.service');
  const { ModalConfirm } = require('../../../../../Globais/Modal/ModalConfirm');
  const { toastCustom } = require('../../../../../Globais/ToastCustom');
  return { getProcessosAssociacao, createProcessoAssociacao, deleteProcessoAssociacao, getPeriodosDisponiveis, updateProcessoAssociacao, visoesService, ModalConfirm, toastCustom };
};

const setupServices = () => {
  const svc = getServices();
  svc.getProcessosAssociacao.mockResolvedValue([PROCESS]);
  svc.createProcessoAssociacao.mockResolvedValue({ status: 201 });
  svc.deleteProcessoAssociacao.mockResolvedValue({ status: 204 });
  svc.getPeriodosDisponiveis.mockResolvedValue([]);
  svc.updateProcessoAssociacao.mockResolvedValue({ status: 200 });
  svc.visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);
  svc.visoesService.getPermissoes = jest.fn().mockReturnValue(true);
  svc.ModalConfirm.mockImplementation(({ onConfirm }) => {
    capturedOnConfirm = onConfirm;
    return null;
  });
};

const renderComponent = (props = {}) =>
  render(
    <Provider store={mockStore}>
      <ProcessosSeiPrestacaoDeContas {...globalProps} {...props} />
    </Provider>
  );

const waitForTable = () => waitFor(() => expect(screen.getByTestId('table')).toBeInTheDocument());

describe('ProcessosSeiPrestacaoDeContas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedFormProps = null;
    capturedOnConfirm = null;
    setupServices();
  });

  describe('Rendering', () => {
    test('1. Renders title and table after loading', async () => {
      renderComponent();
      expect(await screen.findByText('Processos SEI de prestação de contas')).toBeInTheDocument();
      expect(await screen.findByTestId('table')).toBeInTheDocument();
    });

    test('2. Shows empty state message when no processes exist', async () => {
      const { getProcessosAssociacao } = getServices();
      getProcessosAssociacao.mockResolvedValue([]);
      renderComponent();
      expect(await screen.findByTestId('msg-empty')).toBeInTheDocument();
    });

    test('3. Renders nothing when associacao uuid is undefined', () => {
      renderComponent({
        dadosDaAssociacao: {
          dados_da_associacao: { uuid: undefined, recursos_da_associacao: [] },
        },
      });
      expect(screen.queryByText('Processos SEI de prestação de contas')).not.toBeInTheDocument();
    });

    test('4. Shows recurso_nome label when multiple recursos and flag is active', async () => {
      const { visoesService } = getServices();
      visoesService.featureFlagAtiva = jest.fn((flag) =>
        flag === 'premio-excelencia-processo-sei' ? true : false
      );
      renderComponent({
        dadosDaAssociacao: {
          dados_da_associacao: {
            uuid: 'assoc-1',
            recursos_da_associacao: [{ uuid: 'r1' }, { uuid: 'r2' }],
          },
        },
        recurso_nome: 'Prêmio Excelência',
      });
      expect(await screen.findByText('Prêmio Excelência')).toBeInTheDocument();
    });

    test('5. Hides recurso_nome when only one recurso even if flag is active', async () => {
      const { visoesService } = getServices();
      visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
      renderComponent({ recurso_nome: 'Prêmio Excelência' });
      await waitForTable();
      expect(screen.queryByText('Prêmio Excelência')).not.toBeInTheDocument();
    });

    test('6. Hides recurso_nome when flag is inactive even with multiple recursos', async () => {
      renderComponent({
        dadosDaAssociacao: {
          dados_da_associacao: {
            uuid: 'assoc-1',
            recursos_da_associacao: [{ uuid: 'r1' }, { uuid: 'r2' }],
          },
        },
        recurso_nome: 'Prêmio Excelência',
      });
      await waitForTable();
      expect(screen.queryByText('Prêmio Excelência')).not.toBeInTheDocument();
    });

    test('7. Renders periodos column when periodos-processo-sei flag is active', async () => {
      const { visoesService } = getServices();
      visoesService.featureFlagAtiva = jest.fn((flag) =>
        flag === 'periodos-processo-sei' ? true : false
      );
      renderComponent();
      expect(await screen.findByText('2024.1')).toBeInTheDocument();
    });

    test('8. periodosTemplate renders nothing for rows with empty periodos', async () => {
      const { getProcessosAssociacao, visoesService } = getServices();
      getProcessosAssociacao.mockResolvedValue([{ ...PROCESS, periodos: [] }]);
      visoesService.featureFlagAtiva = jest.fn((flag) =>
        flag === 'periodos-processo-sei' ? true : false
      );
      renderComponent();
      await waitForTable();
      expect(screen.queryByText('2024.1')).not.toBeInTheDocument();
    });
  });

  describe('handleAddProcessoAction', () => {
    test('9. Opens form with empty values when clicking adicionar', async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      expect(await screen.findByTestId('form')).toBeInTheDocument();
      expect(capturedFormProps.initialValues.uuid).toBe('');
      expect(capturedFormProps.initialValues.numero_processo).toBe('');
      expect(capturedFormProps.initialValues.periodos).toEqual([]);
    });

    test('10. Add button is no-op when user has no permission', async () => {
      const { visoesService } = getServices();
      visoesService.getPermissoes = jest.fn().mockReturnValue(false);
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      expect(screen.queryByTestId('form')).not.toBeInTheDocument();
    });
  });

  describe('handleEditProcessoAction', () => {
    test('11. Opens form pre-filled with processo data when clicking edit', async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByTestId('edit-btn'));
      expect(await screen.findByTestId('form')).toBeInTheDocument();
      expect(capturedFormProps.initialValues.uuid).toBe('p1');
      expect(capturedFormProps.initialValues.numero_processo).toBe(PROCESS.numero_processo);
      expect(capturedFormProps.initialValues.ano).toBe('2024');
      expect(capturedFormProps.initialValues.periodos).toEqual(['per-1']);
    });
  });

  describe('handleDeleteProcessoAction', () => {
    test('12. Shows confirm-delete dialog when clicking delete button', async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByTestId('delete-btn'));
      expect(await screen.findByTestId('confirm-delete')).toBeInTheDocument();
    });
  });

  describe('handleCloseProcessoForm', () => {
    test('13. Hides form when close button is clicked', async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      expect(await screen.findByTestId('form')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('form-close'));
      expect(screen.queryByTestId('form')).not.toBeInTheDocument();
    });
  });

  describe('Delete confirmation dialog', () => {
    const openDeleteDialog = async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByTestId('delete-btn'));
      await screen.findByTestId('confirm-delete');
    };

    test('14. Confirm delete calls deleteProcessoAssociacao and shows success toast', async () => {
      const { deleteProcessoAssociacao, toastCustom } = getServices();
      await openDeleteDialog();
      await act(async () => {
        fireEvent.click(screen.getByTestId('btn-confirm-delete'));
      });
      await waitFor(() => {
        expect(deleteProcessoAssociacao).toHaveBeenCalledWith('p1');
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
      });
    });

    test('15. Shows error toast when deleteProcessoAssociacao returns non-204', async () => {
      const { deleteProcessoAssociacao, toastCustom } = getServices();
      deleteProcessoAssociacao.mockResolvedValue({ status: 500 });
      await openDeleteDialog();
      await act(async () => {
        fireEvent.click(screen.getByTestId('btn-confirm-delete'));
      });
      await waitFor(() => {
        expect(toastCustom.ToastCustomError).toHaveBeenCalled();
      });
    });

    test('16. Cancel delete closes dialog without calling deleteProcessoAssociacao', async () => {
      const { deleteProcessoAssociacao } = getServices();
      await openDeleteDialog();
      fireEvent.click(screen.getByTestId('btn-cancel-delete'));
      expect(screen.queryByTestId('confirm-delete')).not.toBeInTheDocument();
      expect(deleteProcessoAssociacao).not.toHaveBeenCalled();
    });
  });

  describe('handleSubmitProcesso – create (no uuid)', () => {
    const openAddAndSubmit = async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      await screen.findByTestId('form');
      await act(async () => {
        fireEvent.click(screen.getByTestId('form-submit'));
      });
    };

    test('17. Create 201 shows success toast and closes form', async () => {
      const { toastCustom } = getServices();
      await openAddAndSubmit();
      await waitFor(() => {
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        expect(screen.queryByTestId('form')).not.toBeInTheDocument();
      });
    });

    test('18. Create 400 with numero_processo sets custom error message', async () => {
      const { createProcessoAssociacao } = getServices();
      createProcessoAssociacao.mockResolvedValue({
        status: 400,
        data: { numero_processo: ['Processo já cadastrado'] },
      });
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      await screen.findByTestId('form');
      await act(async () => {
        fireEvent.click(screen.getByTestId('form-submit'));
      });
      await waitFor(() => {
        expect(capturedFormProps.customNumeroProcessoError).toBe('Processo já cadastrado');
      });
    });

    test('19. Create 400 without numero_processo closes form', async () => {
      const { createProcessoAssociacao } = getServices();
      createProcessoAssociacao.mockResolvedValue({ status: 400, data: {} });
      await openAddAndSubmit();
      await waitFor(() => {
        expect(screen.queryByTestId('form')).not.toBeInTheDocument();
      });
    });

    test('20. Create exception closes form', async () => {
      const { createProcessoAssociacao } = getServices();
      createProcessoAssociacao.mockRejectedValue(new Error('Network error'));
      await openAddAndSubmit();
      await waitFor(() => {
        expect(screen.queryByTestId('form')).not.toBeInTheDocument();
      });
    });

    test('21. With periodos-processo-sei flag active, payload includes periodos', async () => {
      const { visoesService, createProcessoAssociacao } = getServices();
      visoesService.featureFlagAtiva = jest.fn((flag) =>
        flag === 'periodos-processo-sei' ? true : false
      );
      await openAddAndSubmit();
      await waitFor(() => {
        expect(createProcessoAssociacao).toHaveBeenCalledWith(
          expect.objectContaining({ periodos: [] })
        );
      });
    });
  });

  describe('handleSubmitProcesso – update (with uuid)', () => {
    const openEditAndTriggerConfirm = async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByTestId('edit-btn'));
      await screen.findByTestId('form');
      await act(async () => {
        fireEvent.click(screen.getByTestId('form-submit'));
      });
    };

    test('22. With uuid, calls ModalConfirm with correct title', async () => {
      const { ModalConfirm } = getServices();
      await openEditAndTriggerConfirm();
      await waitFor(() => {
        expect(ModalConfirm).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Atenção!', confirmText: 'Confirmar' })
        );
      });
    });

    test('23. Update 200 shows success toast after confirming modal', async () => {
      const { toastCustom } = getServices();
      await openEditAndTriggerConfirm();
      await waitFor(() => expect(capturedOnConfirm).toBeTruthy());
      await act(async () => { capturedOnConfirm(); });
      await waitFor(() => {
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
      });
    });

    test('24. Update 400 with numero_processo sets custom error after confirming', async () => {
      const { updateProcessoAssociacao } = getServices();
      updateProcessoAssociacao.mockResolvedValue({
        status: 400,
        data: { numero_processo: ['Número inválido'] },
      });
      await openEditAndTriggerConfirm();
      await waitFor(() => expect(capturedOnConfirm).toBeTruthy());
      await act(async () => { capturedOnConfirm(); });
      await waitFor(() => {
        expect(capturedFormProps.customNumeroProcessoError).toBe('Número inválido');
      });
    });

    test('25. Update 400 without numero_processo closes form', async () => {
      const { updateProcessoAssociacao } = getServices();
      updateProcessoAssociacao.mockResolvedValue({ status: 400, data: {} });
      await openEditAndTriggerConfirm();
      await waitFor(() => expect(capturedOnConfirm).toBeTruthy());
      await act(async () => { capturedOnConfirm(); });
      await waitFor(() => {
        expect(screen.queryByTestId('form')).not.toBeInTheDocument();
      });
    });

    test('26. Update exception closes form', async () => {
      const { updateProcessoAssociacao } = getServices();
      updateProcessoAssociacao.mockRejectedValue(new Error('Network error'));
      await openEditAndTriggerConfirm();
      await waitFor(() => expect(capturedOnConfirm).toBeTruthy());
      await act(async () => { capturedOnConfirm(); });
      await waitFor(() => {
        expect(screen.queryByTestId('form')).not.toBeInTheDocument();
      });
    });
  });

  describe('handleChangesInProcessoForm', () => {
    test('27. Changing "ano" field resets periodos to empty array', async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      await screen.findByTestId('form');
      fireEvent.click(screen.getByTestId('form-change-periodos'));
      await waitFor(() => expect(capturedFormProps.initialValues.periodos).toEqual(['p1', 'p2']));
      fireEvent.click(screen.getByTestId('form-change-ano'));
      await waitFor(() => {
        expect(capturedFormProps.initialValues.ano).toBe('2024');
        expect(capturedFormProps.initialValues.periodos).toEqual([]);
      });
    });

    test('28. Changing a non-ano field updates only that field', async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      await screen.findByTestId('form');
      fireEvent.click(screen.getByTestId('form-change-numero'));
      await waitFor(() => {
        expect(capturedFormProps.initialValues.numero_processo).toBe('99999');
        expect(capturedFormProps.initialValues.periodos).toEqual([]);
      });
    });
  });

  describe('handleChangeSelectPeriodos', () => {
    test('29. Updates periodos state', async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      await screen.findByTestId('form');
      fireEvent.click(screen.getByTestId('form-change-periodos'));
      await waitFor(() => {
        expect(capturedFormProps.initialValues.periodos).toEqual(['p1', 'p2']);
      });
    });
  });

  describe('carregaPeriodosDisponiveis', () => {
    test('30. Fetches periodos when ano has 4+ chars', async () => {
      const { getPeriodosDisponiveis } = getServices();
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      await screen.findByTestId('form');
      await act(async () => {
        fireEvent.click(screen.getByTestId('form-change-ano'));
      });
      await waitFor(() => {
        expect(getPeriodosDisponiveis).toHaveBeenCalledWith('assoc-1', '2024', '', 'r1');
      });
    });

    test('31. Auto-populates periodos from periodosDisponiveis when periodos is empty', async () => {
      const { getPeriodosDisponiveis } = getServices();
      getPeriodosDisponiveis.mockResolvedValue([
        { uuid: 'pd-1', referencia: '2024.1' },
        { uuid: 'pd-2', referencia: '2024.2' },
      ]);
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      await screen.findByTestId('form');
      await act(async () => {
        fireEvent.click(screen.getByTestId('form-change-ano'));
      });
      await waitFor(() => {
        expect(capturedFormProps.initialValues.periodos).toEqual(['pd-1', 'pd-2']);
      });
    });

    test('32. Does NOT auto-populate periodos when they are already set (edit mode)', async () => {
      const { getPeriodosDisponiveis } = getServices();
      getPeriodosDisponiveis.mockResolvedValue([{ uuid: 'pd-1', referencia: '2024.1' }]);
      renderComponent();
      await waitForTable();
      await act(async () => {
        fireEvent.click(screen.getByTestId('edit-btn'));
      });
      await screen.findByTestId('form');
      await waitFor(() => expect(getPeriodosDisponiveis).toHaveBeenCalled());
      expect(capturedFormProps.initialValues.periodos).toEqual(['per-1']);
    });
  });

  describe('tableActionsTemplate', () => {
    test('33. Delete button is disabled when user has no permission', async () => {
      const { visoesService } = getServices();
      visoesService.getPermissoes = jest.fn().mockReturnValue(false);
      renderComponent();
      await waitForTable();
      expect(screen.getByTestId('delete-btn')).toBeDisabled();
    });

    test('34. Delete button is disabled when processo does not allow deletion', async () => {
      const { getProcessosAssociacao } = getServices();
      getProcessosAssociacao.mockResolvedValue([{ ...PROCESS, permite_exclusao: false }]);
      renderComponent();
      await waitForTable();
      expect(screen.getByTestId('delete-btn')).toBeDisabled();
    });

    test('35. Edit and delete buttons are enabled when permitted', async () => {
      renderComponent();
      await waitForTable();
      expect(screen.getByTestId('edit-btn')).not.toBeDisabled();
      expect(screen.getByTestId('delete-btn')).not.toBeDisabled();
    });
  });

  describe('Service calls', () => {
    test('36. Calls getProcessosAssociacao with correct args on mount', async () => {
      const { getProcessosAssociacao } = getServices();
      renderComponent();
      await waitFor(() => {
        expect(getProcessosAssociacao).toHaveBeenCalledWith('assoc-1', 'r1');
      });
    });

    test('37. Re-fetches processes when recurso_uuid prop changes', async () => {
      const { getProcessosAssociacao } = getServices();
      const { rerender } = renderComponent();
      await waitForTable();
      rerender(
        <Provider store={mockStore}>
          <ProcessosSeiPrestacaoDeContas {...globalProps} recurso_uuid="r2" />
        </Provider>
      );
      await waitFor(() => {
        expect(getProcessosAssociacao).toHaveBeenCalledWith('assoc-1', 'r2');
      });
    });

    test('38. deleteProcesso catch block handles thrown errors gracefully', async () => {
      const { deleteProcessoAssociacao } = getServices();
      deleteProcessoAssociacao.mockRejectedValue(new Error('Network error'));
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByTestId('delete-btn'));
      await screen.findByTestId('confirm-delete');
      await act(async () => {
        fireEvent.click(screen.getByTestId('btn-confirm-delete'));
      });
      await waitFor(() => expect(screen.getByTestId('table')).toBeInTheDocument());
    });

    test('39. validateProcessoForm resolves to an empty object', async () => {
      renderComponent();
      await waitForTable();
      fireEvent.click(screen.getByText('adicionar'));
      await screen.findByTestId('form');
      const result = await capturedFormProps.validateForm();
      expect(result).toEqual({});
    });
  });
});
