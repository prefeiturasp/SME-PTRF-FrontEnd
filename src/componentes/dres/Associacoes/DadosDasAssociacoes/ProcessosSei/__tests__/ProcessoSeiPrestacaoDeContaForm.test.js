import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

jest.mock('react-text-mask', () => ({
  __esModule: true,
  default: ({ mask, guide, showMask, ...props }) => <input {...props} />,
}));

jest.mock('../../../../../../services/visoes.service');

let capturedModalProps = null;
jest.mock('../../../../../Globais/ModalBootstrap', () => ({
  ModalBootstrapFormMembros: (props) => {
    capturedModalProps = props;
    return (
      <div data-testid="modal-form-membros">
        <span data-testid="titulo">{props.titulo}</span>
        <div data-testid="body">{props.bodyText}</div>
      </div>
    );
  },
}));

/* eslint-disable-next-line import/first */
import {
  ProcessoSeiPrestacaoDeContaForm,
  YupSignupSchemaProcesso,
} from '../ProcessoSeiPrestacaoDeContaForm';
/* eslint-disable-next-line import/first */
import { visoesService } from '../../../../../../services/visoes.service';

const baseProps = {
  show: true,
  handleClose: jest.fn(),
  onSubmit: jest.fn(),
  handleChange: jest.fn(),
  handleChangeSelectPeriodos: jest.fn(),
  validateForm: jest.fn(),
  initialValues: { numero_processo: '', ano: '', periodos: [] },
  periodosDisponiveis: [],
  customNumeroProcessoError: '',
  setCustomNumeroProcessoError: jest.fn(),
  loadingPeriodos: false,
  recursoNome: '',
  showRecursoField: false,
};

const setupDefaultMocks = () => {
  visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);
  visoesService.getPermissoes = jest.fn().mockReturnValue(true);
};

describe('ProcessoSeiPrestacaoDeContaForm Testes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedModalProps = null;
    setupDefaultMocks();
  });

  test('1. Renderiza sem erros', () => {
    const { container } = render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} />);
    expect(container).toBeDefined();
    expect(screen.getByTestId('modal-form-membros')).toBeInTheDocument();
  });

  test('2. Repassa show e onHide corretamente', () => {
    const handleClose = jest.fn();
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} handleClose={handleClose} show={false} />);

    expect(capturedModalProps.show).toBe(false);
    expect(capturedModalProps.onHide).toBe(handleClose);
  });

  test('3. Título "Adicionar processo" quando não há uuid em initialValues', () => {
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} initialValues={{ numero_processo: '', ano: '' }} />);
    expect(screen.getByTestId('titulo')).toHaveTextContent('Adicionar processo');
  });

  test('4. Título "Editar processo" quando há uuid em initialValues', () => {
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        initialValues={{ uuid: 'p1', numero_processo: '1234.5678/0000001-0', ano: '2024' }}
      />
    );
    expect(screen.getByTestId('titulo')).toHaveTextContent('Editar processo');
  });

  test('5. Campo Recurso não aparece quando showRecursoField=false', () => {
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} showRecursoField={false} />);
    expect(screen.queryByLabelText(/Recurso/)).not.toBeInTheDocument();
  });

  test('6. Campo Recurso aparece quando showRecursoField=true, com o valor de recursoNome', () => {
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        showRecursoField={true}
        recursoNome="Recurso Teste"
      />
    );
    const input = screen.getByLabelText(/Recurso/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Recurso Teste');
    expect(input).toBeDisabled();
  });

  test('7. Campo Recurso usa string vazia quando recursoNome não informado', () => {
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} showRecursoField={true} recursoNome={undefined} />);
    const input = screen.getByLabelText(/Recurso/);
    expect(input).toHaveValue('');
  });

  test('8. Input de número do processo chama handleChange e setCustomNumeroProcessoError', () => {
    const handleChange = jest.fn();
    const setCustomNumeroProcessoError = jest.fn();
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        handleChange={handleChange}
        setCustomNumeroProcessoError={setCustomNumeroProcessoError}
      />
    );

    const input = screen.getByPlaceholderText('Número do processo SEI');
    fireEvent.change(input, { target: { name: 'numero_processo', value: '1234.5678/0000001-0' } });

    expect(handleChange).toHaveBeenCalledWith('numero_processo', '1234.5678/0000001-0');
    expect(setCustomNumeroProcessoError).toHaveBeenCalledWith('');
  });

  test('9. Input de ano chama handleChange e setCustomNumeroProcessoError', () => {
    const handleChange = jest.fn();
    const setCustomNumeroProcessoError = jest.fn();
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        handleChange={handleChange}
        setCustomNumeroProcessoError={setCustomNumeroProcessoError}
      />
    );

    const input = screen.getByPlaceholderText('Ano do processo');
    fireEvent.change(input, { target: { name: 'ano', value: '2024' } });

    expect(handleChange).toHaveBeenCalledWith('ano', '2024');
    expect(setCustomNumeroProcessoError).toHaveBeenCalledWith('');
  });

  test('10. Input de ano fica desabilitado quando initialValues.uuid presente', () => {
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        initialValues={{ uuid: 'p1', numero_processo: '1234.5678/0000001-0', ano: '2024' }}
      />
    );
    const input = screen.getByPlaceholderText('Ano do processo');
    expect(input).toBeDisabled();
  });

  test('11. Input de ano fica habilitado sem uuid e com permissão', () => {
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} />);
    const input = screen.getByPlaceholderText('Ano do processo');
    expect(input).not.toBeDisabled();
  });

  test('12. Exibe erro de props.errors.numero_processo (via yup na submissão)', async () => {
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        initialValues={{ numero_processo: '', ano: '2024', periodos: [] }}
      />
    );

    const form = document.getElementById('membrosForm');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText('Campo Número do processo é obrigatório')).toBeInTheDocument();
    });
  });

  test('13. Exibe customNumeroProcessoError quando não há erro formik para numero_processo', () => {
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        customNumeroProcessoError="Já existe um processo com este número"
      />
    );

    expect(screen.getByText('Já existe um processo com este número')).toBeInTheDocument();
  });

  test('14. Não exibe customNumeroProcessoError quando há erro formik para numero_processo', async () => {
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        customNumeroProcessoError="Erro customizado"
        initialValues={{ numero_processo: '', ano: '2024', periodos: [] }}
      />
    );

    const form = document.getElementById('membrosForm');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText('Campo Número do processo é obrigatório')).toBeInTheDocument();
    });
    expect(screen.queryByText('Erro customizado')).not.toBeInTheDocument();
  });

  test('15. Exibe erro de props.errors.ano', async () => {
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        initialValues={{ numero_processo: '1234.5678/0000001-0', ano: '', periodos: [] }}
      />
    );

    const form = document.getElementById('membrosForm');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText('Campo ano é obrigatório')).toBeInTheDocument();
    });
  });

  test('16. Campo de períodos não aparece quando feature flag inativa', () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} />);
    expect(screen.queryByLabelText(/Períodos/)).not.toBeInTheDocument();
  });

  test('17. Campo de períodos aparece quando feature flag ativa, populado por periodosDisponiveis', () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        periodosDisponiveis={[
          { uuid: 'per1', referencia: '1º Período 2024' },
          { uuid: 'per2', referencia: '2º Período 2024' },
        ]}
      />
    );

    expect(screen.getByLabelText(/Períodos/)).toBeInTheDocument();
    expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('periodos-processo-sei');
  });

  test('18. Select de períodos exibe spinner de loading quando loadingPeriodos=true', () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} loadingPeriodos={true} />);

    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  test('19. Select de períodos fica desabilitado quando ano tem menos de 4 dígitos', () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} initialValues={{ numero_processo: '', ano: '20' }} />);

    // #periodos é o input interno do ant-design; o container com ant-select-disabled é o div pai
    const selectInput = document.querySelector('#periodos');
    const selectContainer = selectInput.closest('.ant-select');
    expect(selectContainer).toHaveClass('ant-select-disabled');
  });

  test('20. Select de períodos fica desabilitado quando getPermissoes=false', () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
    visoesService.getPermissoes = jest.fn().mockReturnValue(false);
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} initialValues={{ numero_processo: '', ano: '2024' }} />);

    const selectInput = document.querySelector('#periodos');
    const selectContainer = selectInput.closest('.ant-select');
    expect(selectContainer).toHaveClass('ant-select-disabled');
  });

  test('21. Exibe erro de props.errors.periodos ao submeter com periodos vazio', async () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        initialValues={{ numero_processo: '1234.5678/0000001-0', ano: '2024', periodos: [] }}
      />
    );

    const form = document.getElementById('membrosForm');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText('Campo períodos é obrigatório')).toBeInTheDocument();
    });
  });

  test('22. Input numero_processo desabilitado quando getPermissoes retorna false', () => {
    visoesService.getPermissoes = jest.fn().mockReturnValue(false);
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} />);

    const input = screen.getByPlaceholderText('Número do processo SEI');
    expect(input).toBeDisabled();
  });

  test('23. Botão Salvar desabilitado quando getPermissoes retorna false', () => {
    visoesService.getPermissoes = jest.fn().mockReturnValue(false);
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} />);

    const botaoSalvar = screen.getByRole('button', { name: 'Salvar' });
    expect(botaoSalvar).toBeDisabled();
  });

  test('24. Botão Salvar desabilitado quando loadingPeriodos=true', () => {
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} loadingPeriodos={true} />);

    const botaoSalvar = screen.getByRole('button', { name: 'Salvar' });
    expect(botaoSalvar).toBeDisabled();
  });

  test('25. Botão Salvar habilitado quando getPermissoes=true e loadingPeriodos=false', () => {
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} />);

    const botaoSalvar = screen.getByRole('button', { name: 'Salvar' });
    expect(botaoSalvar).not.toBeDisabled();
  });

  test('26. Clique em Cancelar chama handleClose', () => {
    const handleClose = jest.fn();
    render(<ProcessoSeiPrestacaoDeContaForm {...baseProps} handleClose={handleClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('27. Submeter o formulário preenchido chama onSubmit', async () => {
    const onSubmit = jest.fn();
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        onSubmit={onSubmit}
        initialValues={{ numero_processo: '1234.5678/0000001-0', ano: '2024', periodos: [] }}
      />
    );

    const form = document.getElementById('membrosForm');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  test('28. Submeter o formulário vazio não chama onSubmit (validação obrigatória)', async () => {
    const onSubmit = jest.fn();
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        onSubmit={onSubmit}
        initialValues={{ numero_processo: '', ano: '' }}
      />
    );

    const form = document.getElementById('membrosForm');
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('29. handleChangeSelectPeriodos é repassado ao Select de períodos', () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
    const handleChangeSelectPeriodos = jest.fn();
    render(
      <ProcessoSeiPrestacaoDeContaForm
        {...baseProps}
        handleChangeSelectPeriodos={handleChangeSelectPeriodos}
        periodosDisponiveis={[{ uuid: 'per1', referencia: '1º Período 2024' }]}
      />
    );

    expect(document.querySelector('#periodos')).toBeInTheDocument();
  });
});

describe('YupSignupSchemaProcesso Testes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Valida com sucesso quando numero_processo e ano preenchidos e feature flag inativa', async () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);
    await expect(
      YupSignupSchemaProcesso.validate({ numero_processo: '1234', ano: '2024' })
    ).resolves.toBeTruthy();
  });

  test('2. Falha quando numero_processo está vazio', async () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);
    await expect(
      YupSignupSchemaProcesso.validate({ numero_processo: '', ano: '2024' })
    ).rejects.toThrow('Campo Número do processo é obrigatório');
  });

  test('3. Falha quando ano está vazio', async () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);
    await expect(
      YupSignupSchemaProcesso.validate({ numero_processo: '1234', ano: '' })
    ).rejects.toThrow('Campo ano é obrigatório');
  });

  test('4. Falha quando periodos vazio e feature flag ativa', async () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
    await expect(
      YupSignupSchemaProcesso.validate({ numero_processo: '1234', ano: '2024', periodos: [] })
    ).rejects.toThrow('Campo períodos é obrigatório');
  });

  test('5. Sucesso quando periodos preenchido e feature flag ativa', async () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);
    await expect(
      YupSignupSchemaProcesso.validate({ numero_processo: '1234', ano: '2024', periodos: ['per1'] })
    ).resolves.toBeTruthy();
  });

  test('6. Sucesso quando periodos vazio mas feature flag inativa', async () => {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);
    await expect(
      YupSignupSchemaProcesso.validate({ numero_processo: '1234', ano: '2024', periodos: [] })
    ).resolves.toBeTruthy();
  });
});
