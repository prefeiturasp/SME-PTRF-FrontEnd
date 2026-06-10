import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AtaRetificacao } from '../index'; 

describe('Componente <AtaRetificacao />', () => {
    const createMockProps = () => ({
        getNomeUnidadeEducacional: jest.fn(() => 'EMEF Castro Alves'),
        getDiaPorExtenso: jest.fn(() => 'dezesseis'),
        getMesPorExtenso: jest.fn(() => 'outubro'),
        getAnoPorExtenso: jest.fn(() => 'dois mil e vinte e seis'),
        getLocalReuniao: jest.fn(() => 'Auditório Principal'),
        getNomeUnidade: jest.fn(() => 'Unidade Centro'),
        getHoraInicio: jest.fn(() => 'quatorze horas'),
        getPeriodoPaaFormatado: jest.fn(() => '2026/2027'),
        getDataFormatada: jest.fn((data) => `formatada(${data})`),
        dataReuniaoElaboracao: '2026-10-01',
        getNomePresidente: jest.fn(() => 'Fulano de Tal'),
        getTipoUnidadeComNome: jest.fn(() => 'APM da Unidade Centro'),
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o título principal corretamente', () => {
        const mockProps = createMockProps();
        render(<AtaRetificacao {...mockProps} />);

        const tituloPrincipal = screen.getByText(/Ata da Reunião conjunta ordinária da Associação de EMEF Castro Alves para retificação/i);
        
        expect(tituloPrincipal).toBeInTheDocument();
    });

    it('deve chamar todas as funções de callback das props para montar o texto dinâmico', () => {
        const mockProps = createMockProps();
        render(<AtaRetificacao {...mockProps} />);

        Object.keys(mockProps).forEach((propName) => {
            if (typeof mockProps[propName] === 'function') {
                expect(mockProps[propName]).toHaveBeenCalledTimes(1);
            }
        });
    });

    it('deve renderizar o parágrafo descritivo contendo todas as variáveis injetadas corretamente', () => {
        const mockProps = createMockProps();
        render(<AtaRetificacao {...mockProps} />);

        const paragrafoDinamico = screen.getByText(/Aos dezesseis do mês de outubro de dois mil e vinte e seis/i);
        
        expect(paragrafoDinamico).toBeInTheDocument();
        expect(paragrafoDinamico).toHaveTextContent('na(o) Auditório Principal');
        expect(paragrafoDinamico).toHaveTextContent('da Unidade Educacional Unidade Centro');
        expect(paragrafoDinamico).toHaveTextContent('às quatorze horas');
        expect(paragrafoDinamico).toHaveTextContent('membros da Associação de APM da Unidade Centro e Conselho de Escola');
    });

    it('deve renderizar o parágrafo do presidente passando o argumento correto para getDataFormatada', () => {
        const mockProps = createMockProps();
        render(<AtaRetificacao {...mockProps} />);

        const paragrafoPresidente = screen.getByText(/Aberta a sessão, em convocação pelo\(a\) Senhor\(a\) Fulano de Tal/i);

        expect(paragrafoPresidente).toBeInTheDocument();
        expect(paragrafoPresidente).toHaveTextContent('para o período de 2026/2027');
        expect(paragrafoPresidente).toHaveTextContent('Ata da Assembleia Geral de formatada(2026-10-01)');
        
        expect(mockProps.getDataFormatada).toHaveBeenCalledWith('2026-10-01');
    });

    it('deve renderizar os textos jurídicos e estáticos obrigatórios da ata de retificação', () => {
        const mockProps = createMockProps();
        render(<AtaRetificacao {...mockProps} />);

        expect(screen.getByText(/inciso XIII do artigo 118, da Lei nº 14\.660\/2007/i)).toBeInTheDocument();
        expect(screen.getByText(/O\(A\) Senhor\(a\) Presidente informou todas as prioridades contempladas até o momento, e as que não foram executadas/i)).toBeInTheDocument();
        expect(screen.getByText(/propôs rever se há necessidade de estabelecimento de novas prioridades/i)).toBeInTheDocument();
        expect(screen.getByText(/recursos reprogramados e transferidos pelo PTRF, PDDE, Prêmio de Excelência Educacional e outros recursos/i)).toBeInTheDocument();
        expect(screen.getByText(/de acordo com as mudanças, atualizando o atual PAA/i)).toBeInTheDocument();
    });
});