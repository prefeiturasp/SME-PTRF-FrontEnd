import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelecionaRecurso } from '../index';
import { ModalConfirm } from '../../Modal/ModalConfirm';

import { visoesService } from '../../../../services/visoes.service';
import { getRecursosDisponiveis } from '../../../../services/AlterarRecurso.service';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../Modal/ModalConfirm', () => ({
  ModalConfirm: jest.fn(),
}));

jest.mock('../../../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(),
  },
}));

jest.mock('../../../../services/AlterarRecurso.service', () => ({
  getRecursosDisponiveis: jest.fn(),
}));

jest.mock('antd', () => ({
  Select: ({ options, onChange }) => (
    <select
      data-testid="select-recurso"
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

describe('SelecionaRecurso', () => {
  const recursosMock = [
    { uuid: '1', nome_exibicao: 'Recurso A', icone: 'a.png' },
    { uuid: '2', nome_exibicao: 'Recurso B', icone: 'b.png' },
  ];

  test('não renderiza select quando há apenas um recurso', async () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);
    getRecursosDisponiveis.mockResolvedValue([recursosMock[0]]);

    render(<SelecionaRecurso />);

    await waitFor(() => {
      expect(screen.queryByTestId('select-recurso')).not.toBeInTheDocument();
    });
  });

  test('renderiza select quando há mais de um recurso', async () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);
    getRecursosDisponiveis.mockResolvedValue(recursosMock);

    render(<SelecionaRecurso />);

    expect(await screen.findByTestId('select-recurso')).toBeInTheDocument();
  });

  test('abre modal ao trocar recurso', async () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);
    getRecursosDisponiveis.mockResolvedValue(recursosMock);

    render(<SelecionaRecurso />);

    const select = await screen.findByTestId('select-recurso');

    await userEvent.selectOptions(select, '2');

    expect(ModalConfirm).toHaveBeenCalled();
    expect(ModalConfirm.mock.calls[0][0]).toMatchObject({
      title: 'Trocar de Recurso',
      confirmText: 'Trocar',
    });
  });

  test('salva recurso no localStorage ao confirmar a troca', async () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);
    getRecursosDisponiveis.mockResolvedValue(recursosMock);

    render(<SelecionaRecurso />);

    const select = await screen.findByTestId('select-recurso');
    await userEvent.selectOptions(select, '2');

    const { onConfirm } = ModalConfirm.mock.calls[0][0];

    onConfirm();

    const salvo = JSON.parse(localStorage.getItem('recursoSelecionado'));

    expect(salvo.uuid).toBe('2');
  });

});