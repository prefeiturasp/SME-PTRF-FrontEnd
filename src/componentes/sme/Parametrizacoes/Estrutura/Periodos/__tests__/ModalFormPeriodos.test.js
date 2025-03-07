import React, {act} from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import ModalFormPeriodos from '../ModalFormPeriodos';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(() => true),
}));

describe('ModalFormPeriodos Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnHandleClose = jest.fn();
  const mockSetErroDatasAtendemRegras = jest.fn();
  const mockSetShowModalConfirmDeletePeriodo = jest.fn();

  const initialProps = {
    show: true,
    stateFormModal: {
      referencia: '2025.1',
      data_prevista_repasse: '2025-01-01',
      data_inicio_realizacao_despesas: '2025-01-01',
      data_fim_realizacao_despesas: null,
      data_inicio_prestacao_contas: null,
      data_fim_prestacao_contas: null,
      periodo_anterior: 'uuid-fake-periodo-anterior',
      uuid: "periodo-uuid-fake-1",
      editavel: true,
      operacao: 'edit',
    },
    deveValidarPeriodoAnterior: true,
    erroDatasAtendemRegras: '',
    periodos: [
      {
          "uuid": "periodo-uuid-fake-1",
          "referencia": "2025.1",
          "data_inicio_realizacao_despesas": "2025-01-01",
          "data_fim_realizacao_despesas": "2025-04-30",
          "data_prevista_repasse": null,
          "data_inicio_prestacao_contas": "2025-05-01",
          "data_fim_prestacao_contas": "2025-05-10",
          "editavel": true,
          "periodo_anterior": {
              "uuid": "periodo-uuid-fake-2",
              "referencia": "2024.3",
              "data_inicio_realizacao_despesas": "2024-09-01",
              "data_fim_realizacao_despesas": "2024-12-31",
              "referencia_por_extenso": "3° repasse de 2024"
          }
      },
      {
          "uuid": "periodo-uuid-fake-2",
          "referencia": "2024.3",
          "data_inicio_realizacao_despesas": "2024-09-01",
          "data_fim_realizacao_despesas": "2024-12-31",
          "data_prevista_repasse": null,
          "data_inicio_prestacao_contas": "2025-02-01",
          "data_fim_prestacao_contas": "2025-02-10",
          "editavel": false,
          "periodo_anterior": {
              "uuid": "periodo-uuid-fake-3",
              "referencia": "2024.2",
              "data_inicio_realizacao_despesas": "2024-05-01",
              "data_fim_realizacao_despesas": "2024-08-31",
              "referencia_por_extenso": "2° repasse de 2024"
          }
      },
    ],
    onSubmit: mockOnSubmit,
    onHandleClose: mockOnHandleClose,
    setErroDatasAtendemRegras: mockSetErroDatasAtendemRegras,
    setShowModalConfirmDeletePeriodo: mockSetShowModalConfirmDeletePeriodo,
  };

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  test('deve renderizar o modal com os campos', () => {
    
    render(
      <ModalFormPeriodos {...initialProps} />
    );

    expect(screen.getByLabelText(/Referencia */i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data prevista do repasse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Início realização de despesas */i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fim realização de despesas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Início prestação de contas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fim prestação de contas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Período anterior */i)).toBeInTheDocument();
  });

  test('deve chamar o submit quando o formulário for submetido', async () => {
    
    render(
      <ModalFormPeriodos {...initialProps} />
    );

    await act(async () => {
      fireEvent.click(screen.getByText(/Salvar/i));
    });
  
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('deve chamar o onHandleClose quando o botão de fechar for chamado', () => {

    render(
      <ModalFormPeriodos {...initialProps} />
    );

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(mockOnHandleClose).toHaveBeenCalled();
  });

  test('deve chamar o setShowModalConfirmDeletePeriodo quando o botão de apagar for chamado', () => {

    render(
      <ModalFormPeriodos {...initialProps} />
    );

    fireEvent.click(screen.getByText(/Apagar/i));
    expect(mockSetShowModalConfirmDeletePeriodo).toHaveBeenCalled();
  });

  test('deve chamar o setErroDatasAtendemRegras quando o valor de periodo anterior for alterado', () => {

    render(
      <ModalFormPeriodos {...initialProps} />
    );

    const input = screen.getByLabelText(/Período anterior/i);
    fireEvent.change(input, { target: { name: "periodo_anterior", value: "uuid-fake" } });
  
    expect(mockSetErroDatasAtendemRegras).toHaveBeenCalled();
    expect(mockSetErroDatasAtendemRegras).toHaveBeenCalledWith(false);
  });

  test('deve chamar o setErroDatasAtendemRegras quando o valor de data inicio realizacao despesas for alterado', async () => {

    render(
      <ModalFormPeriodos {...initialProps} />
    );

    const input = screen.getByLabelText("Início realização de despesas *");

    // simulação de change no componente DatePickerField
    userEvent.clear(input);
    userEvent.click(input);
    userEvent.type(input, "01/01/2025");
    userEvent.tab();
    userEvent.keyboard("{Enter}");

    expect(mockSetErroDatasAtendemRegras).toHaveBeenCalled();
    expect(mockSetErroDatasAtendemRegras).toHaveBeenCalledWith(false);
  });

  test('deve renderizar no select de periodo anterior somente os períodos diferentes do período sendo editado', () => {

    render(
      <ModalFormPeriodos {...initialProps} />
    );

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(2);

    const option2024_3 = screen.getByRole("option", { name: "2024.3 - 01/09/2024 até 31/12/2024" });
    expect(option2024_3).toBeInTheDocument();

    const optionDefault = screen.getByRole("option", { name: "Selecione um período" });
    expect(optionDefault).toBeInTheDocument();    
  });
});
