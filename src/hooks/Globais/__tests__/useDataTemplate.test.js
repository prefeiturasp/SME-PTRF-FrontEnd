import { renderHook } from "@testing-library/react";
import useDataTemplate from '../useDataTemplate';
import moment from 'moment';
import React from 'react';
import { render } from '@testing-library/react';

describe('useDataTemplate', () => {
  it('deve formatar data usando rowData e column', () => {
    const { result } = renderHook(() => useDataTemplate());

    const rowData = { data_criacao: '2023-01-15' };
    const column = { field: 'data_criacao' };

    const component = result.current(rowData, column);

    const { getByText } = render(component);
    expect(getByText('15/01/2023')).toBeInTheDocument();
  });

  it('deve exibir "-" quando rowData[column.field] estiver ausente', () => {
    const { result } = renderHook(() => useDataTemplate());

    const rowData = { outra_data: '2023-01-15' };
    const column = { field: 'data_criacao' };

    const component = result.current(rowData, column);

    const { getByText } = render(component);
    expect(getByText('-')).toBeInTheDocument();
  });

  it('deve formatar data diretamente quando data_passada é fornecida', () => {
    const { result } = renderHook(() => useDataTemplate());

    const dataPassada = '2022-12-01';

    const formatted = result.current('', '', dataPassada);
    expect(formatted).toBe(moment(dataPassada).format('DD/MM/YYYY'));
  });

  it('deve retornar "-" quando data_passada for nula', () => {
    const { result } = renderHook(() => useDataTemplate());

    const formatted = result.current(' ', ' ', null);
    expect(formatted).toEqual(<div className="p-1">-</div>);
  });
});
