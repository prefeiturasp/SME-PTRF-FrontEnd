import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Relatorios from '../index';
import { useGetPaaVigente } from '../hooks/useGetPaaVigente';
import { useGetTextosPaa } from '../hooks/useGetTextosPaa';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


jest.mock('../hooks/useGetTextosPaa', () => ({
  useGetTextosPaa: jest.fn(),
}));

jest.mock('../hooks/useGetPaaVigente', () => ({
    useGetPaaVigente: jest.fn(),
}));

describe('Relatorios', () => {
    let queryClient;
  beforeEach(() => {
    queryClient = new QueryClient({
        defaultOptions: {
        queries: { retry: false },
        },
    });
    localStorage.setItem('ASSOCIACAO_UUID', 'mock-assoc');
    useGetPaaVigente.mockResolvedValue({
      paaVigente: { uuid: '123', texto_introducao: 'Texto existente', texto_conclusao: 'Conclusão existente' },
      isLoading: false,
    })
    useGetTextosPaa.mockResolvedValue({
        textosPaa: { 
            introducao_do_paa_ue_1: '<p>Intro 1</p>',
            introducao_do_paa_ue_2: '<p>Intro 2</p>',
            conclusao_do_paa_ue_1: '<p>Conclusão 1</p>',
            conclusao_do_paa_ue_2: '<p>Conclusão 2</p>',
        },
        isLoading: false,
        isError: false,
    })
  });

  it('renderiza o header e botões', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Relatorios />
        </QueryClientProvider>
    );
    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByText('Prévias')).toBeInTheDocument();
    expect(screen.getByText('Gerar')).toBeInTheDocument();
  });

  it('expande e renderiza subseções ao clicar no chevron', () => {
    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <Relatorios />
        </QueryClientProvider>
    );
    
    const btn = screen.getByRole('button', { name: /Abrir/i });
    fireEvent.click(btn);

    expect(container.querySelector('.render-secao-introducao')).toBeInTheDocument();
    expect(container.querySelector('.render-secao-objetivos')).toBeInTheDocument();
    expect(container.querySelector('.render-secao-componentes')).toBeInTheDocument();
    expect(container.querySelector('.render-secao-conclusao')).toBeInTheDocument();
  });

  it('fecha as subseções ao clicar novamente no chevron', () => {
    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <Relatorios />
        </QueryClientProvider>
    );
    const btn = screen.getByRole('button', { name: /Abrir/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(container.querySelector('.render-secao-introducao')).not.toBeInTheDocument();
    expect(container.querySelector('.render-secao-objetivos')).not.toBeInTheDocument();
    expect(container.querySelector('.render-secao-componentes')).not.toBeInTheDocument();
    expect(container.querySelector('.render-secao-conclusao')).not.toBeInTheDocument();
  });
});
