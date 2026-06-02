import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useGruposAcesso } from '../useGruposAcesso';
import { GestaoDeUsuariosListContext } from '../../context/GestaoDeUsuariosListProvider';
import { getGrupos } from '../../../../../services/GestaoDeUsuarios.service';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    getGrupos: jest.fn(),
}));

const GRUPOS_MOCK = [
    { id: 1, name: 'Grupo Admin' },
    { id: 2, name: 'Grupo Viewer' },
];

const makeWrapper = (ctxValue) =>
    ({ children }) => (
        <GestaoDeUsuariosListContext.Provider value={ctxValue}>
            {children}
        </GestaoDeUsuariosListContext.Provider>
    );

describe('useGruposAcesso', () => {
    let capturedConfig = null;

    beforeEach(() => {
        jest.clearAllMocks();
        capturedConfig = null;
        useQuery.mockImplementation((config) => {
            capturedConfig = config;
            return { data: GRUPOS_MOCK, isLoading: false, isError: false };
        });
    });

    it('retorna os dados fornecidos por useQuery', () => {
        const wrapper = makeWrapper({ visaoBase: 'DRE' });
        const { result } = renderHook(() => useGruposAcesso(), { wrapper });

        expect(result.current.data).toEqual(GRUPOS_MOCK);
        expect(result.current.isLoading).toBe(false);
    });

    it('passa queryKey com visaoBase ao useQuery', () => {
        const wrapper = makeWrapper({ visaoBase: 'DRE' });
        renderHook(() => useGruposAcesso(), { wrapper });

        expect(capturedConfig.queryKey).toEqual(['grupos-acesso-list', 'DRE']);
    });

    it('inclui visaoBase na queryKey para visão SME', () => {
        const wrapper = makeWrapper({ visaoBase: 'SME' });
        renderHook(() => useGruposAcesso(), { wrapper });

        expect(capturedConfig.queryKey).toEqual(['grupos-acesso-list', 'SME']);
    });

    it('inclui visaoBase na queryKey para visão UE', () => {
        const wrapper = makeWrapper({ visaoBase: 'UE' });
        renderHook(() => useGruposAcesso(), { wrapper });

        expect(capturedConfig.queryKey).toEqual(['grupos-acesso-list', 'UE']);
    });

    it('passa keepPreviousData como true ao useQuery', () => {
        const wrapper = makeWrapper({ visaoBase: 'DRE' });
        renderHook(() => useGruposAcesso(), { wrapper });

        expect(capturedConfig.keepPreviousData).toBe(true);
    });

    describe('queryFn', () => {
        it('chama getGrupos com visaoBase correto ao executar queryFn', async () => {
            getGrupos.mockResolvedValue(GRUPOS_MOCK);
            const wrapper = makeWrapper({ visaoBase: 'DRE' });
            renderHook(() => useGruposAcesso(), { wrapper });

            const result = await capturedConfig.queryFn();

            expect(getGrupos).toHaveBeenCalledWith('DRE');
            expect(result).toEqual(GRUPOS_MOCK);
        });

        it('chama getGrupos com visaoBase SME', async () => {
            getGrupos.mockResolvedValue([]);
            const wrapper = makeWrapper({ visaoBase: 'SME' });
            renderHook(() => useGruposAcesso(), { wrapper });

            await capturedConfig.queryFn();

            expect(getGrupos).toHaveBeenCalledWith('SME');
        });

        it('propaga erro como new Error quando getGrupos rejeita', async () => {
            getGrupos.mockRejectedValue('Erro de rede');
            const wrapper = makeWrapper({ visaoBase: 'DRE' });
            renderHook(() => useGruposAcesso(), { wrapper });

            await expect(capturedConfig.queryFn()).rejects.toThrow('Erro de rede');
        });

        it('propaga erro como new Error quando getGrupos lança exceção', async () => {
            getGrupos.mockRejectedValue(new Error('Falha na API'));
            const wrapper = makeWrapper({ visaoBase: 'UE' });
            renderHook(() => useGruposAcesso(), { wrapper });

            await expect(capturedConfig.queryFn()).rejects.toThrow('Error: Falha na API');
        });
    });

    it('retorna isLoading true quando useQuery está carregando', () => {
        useQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
        const wrapper = makeWrapper({ visaoBase: 'DRE' });
        const { result } = renderHook(() => useGruposAcesso(), { wrapper });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
    });

    it('retorna isError true quando useQuery reporta erro', () => {
        useQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
        const wrapper = makeWrapper({ visaoBase: 'DRE' });
        const { result } = renderHook(() => useGruposAcesso(), { wrapper });

        expect(result.current.isError).toBe(true);
    });
});
