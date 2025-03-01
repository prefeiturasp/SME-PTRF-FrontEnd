import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Formik } from 'formik';
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
      data_inicio_realizacao_despesas: null,
      data_fim_realizacao_despesas: null,
      data_inicio_prestacao_contas: null,
      data_fim_prestacao_contas: null,
      periodo_anterior: 'uuid-fake-periodo-anterior',
      uuid: '1234',
      editavel: true,
      operacao: 'edit',
    },
    deveValidarPeriodoAnterior: false,
    erroDatasAtendemRegras: '',
    periodos: [],
    onSubmit: mockOnSubmit,
    onHandleClose: mockOnHandleClose,
    setErroDatasAtendemRegras: mockSetErroDatasAtendemRegras,
    setShowModalConfirmDeletePeriodo: mockSetShowModalConfirmDeletePeriodo,
  };

  test('deve renderizar o modal com os campos', () => {
    render(
      <Formik initialValues={initialProps.stateFormModal} onSubmit={mockOnSubmit}>
        {() => <ModalFormPeriodos {...initialProps} />}
      </Formik>
    );
    expect(screen.getByLabelText(/Referencia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data prevista do repasse/i)).toBeInTheDocument();
  });

  test('deve chamar o submit quando o formulário for submetido', () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    
    render(
      <Formik initialValues={initialProps.stateFormModal} onSubmit={mockOnSubmit}>
        {() => <ModalFormPeriodos {...initialProps} />}
      </Formik>
    );
    fireEvent.submit(screen.getByText(/Salvar/i));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('deve chamar o onHandleClose quando o botão de fechar for chamado', () => {
    render(
      <Formik initialValues={initialProps.stateFormModal} onSubmit={mockOnSubmit}>
        {() => <ModalFormPeriodos {...initialProps} />}
      </Formik>
    );
    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(mockOnHandleClose).toHaveBeenCalled();
  });
});
