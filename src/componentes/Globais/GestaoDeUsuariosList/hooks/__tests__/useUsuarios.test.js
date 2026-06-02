import React from 'react';
import { renderHook } from '@testing-library/react';
import { useUsuarios } from '../useUsuarios';
import { GestaoDeUsuariosListContext } from '../../context/GestaoDeUsuariosListProvider';
import { getUsuarios } from '../../../../../services/GestaoDeUsuarios.service';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    getUsuarios: jest.fn(),
}));

const FILTER_DEFAULT = {
    search: '',
    grupo: '',
    tipoUsuario: '',
    nomeUnidade: '',
    apenasUsuariosDaUnidade: false,
};

const USUARIOS_RESULT = {
    results: [{ id: 1, name: 'Ana' }],
    total_pages: 3,
    count: 25,
};

const makeWrapper = (ctxValue) =>
    ({ children }) => (
        <GestaoDeUsuariosListContext.Provider value={ctxValue}>
            {children}
        </GestaoDeUsuariosListContext.Provider>
    );

const makeCtx = (overrides = {}) => ({
    uuidUnidadeBase: 'uuid-123',
    filter: FILTER_DEFAULT,
    currentPage: 1,
    setTotalPages: jest.fn(),
    setCount: jest.fn(),
    ...overrides,
});

describe('useUsuarios', () => {
    let capturedConfig = null;

    beforeEach(() => {
        jest.clearAllMocks();
        capturedConfig = null;
        useQuery.mockImplementation((config) => {
            capturedConfig = config;
            return { data: USUARIOS_RESULT, isLoading: false, isError: false };
        });
    });

    it('retorna os dados fornecidos por useQuery', () => {
        const wrapper = makeWrapper(makeCtx());
        const { result } = renderHook(() => useUsuarios(), { wrapper });

        expect(result.current.data).toEqual(USUARIOS_RESULT);
        expect(result.current.isLoading).toBe(false);
    });

    it('passa queryKey com uuidUnidadeBase, filter e currentPage ao useQuery', () => {
        const ctx = makeCtx({ uuidUnidadeBase: 'uuid-abc', currentPage: 2 });
        const wrapper = makeWrapper(ctx);
        renderHook(() => useUsuarios(), { wrapper });

        expect(capturedConfig.queryKey).toEqual([
            'usuarios-list',
            'uuid-abc',
            FILTER_DEFAULT,
            2,
        ]);
    });

    it('atualiza queryKey quando filter muda', () => {
        const filterComBusca = { ...FILTER_DEFAULT, search: 'Maria' };
        const ctx = makeCtx({ filter: filterComBusca });
        const wrapper = makeWrapper(ctx);
        renderHook(() => useUsuarios(), { wrapper });

        expect(capturedConfig.queryKey[2]).toEqual(filterComBusca);
    });

    it('passa keepPreviousData como true ao useQuery', () => {
        const wrapper = makeWrapper(makeCtx());
        renderHook(() => useUsuarios(), { wrapper });

        expect(capturedConfig.keepPreviousData).toBe(true);
    });

    it('passa staleTime de 5000ms ao useQuery', () => {
        const wrapper = makeWrapper(makeCtx());
        renderHook(() => useUsuarios(), { wrapper });

        expect(capturedConfig.staleTime).toBe(5000);
    });

    describe('queryFn', () => {
        it('chama getUsuarios com uuidUnidadeBase, filter e currentPage', async () => {
            getUsuarios.mockResolvedValue(USUARIOS_RESULT);
            const ctx = makeCtx({ uuidUnidadeBase: 'uuid-xyz', currentPage: 2 });
            const wrapper = makeWrapper(ctx);
            renderHook(() => useUsuarios(), { wrapper });

            await capturedConfig.queryFn();

            expect(getUsuarios).toHaveBeenCalledWith('uuid-xyz', FILTER_DEFAULT, 2);
        });

        it('retorna o resultado de getUsuarios', async () => {
            getUsuarios.mockResolvedValue(USUARIOS_RESULT);
            const wrapper = makeWrapper(makeCtx());
            renderHook(() => useUsuarios(), { wrapper });

            const result = await capturedConfig.queryFn();

            expect(result).toEqual(USUARIOS_RESULT);
        });

        it('chama setTotalPages com result.total_pages após sucesso', async () => {
            getUsuarios.mockResolvedValue(USUARIOS_RESULT);
            const mockSetTotalPages = jest.fn();
            const ctx = makeCtx({ setTotalPages: mockSetTotalPages });
            const wrapper = makeWrapper(ctx);
            renderHook(() => useUsuarios(), { wrapper });

            await capturedConfig.queryFn();

            expect(mockSetTotalPages).toHaveBeenCalledWith(3);
        });

        it('chama setCount com result.count após sucesso', async () => {
            getUsuarios.mockResolvedValue(USUARIOS_RESULT);
            const mockSetCount = jest.fn();
            const ctx = makeCtx({ setCount: mockSetCount });
            const wrapper = makeWrapper(ctx);
            renderHook(() => useUsuarios(), { wrapper });

            await capturedConfig.queryFn();

            expect(mockSetCount).toHaveBeenCalledWith(25);
        });

        it('chama setTotalPages com undefined quando result não tem total_pages', async () => {
            getUsuarios.mockResolvedValue({ results: [] });
            const mockSetTotalPages = jest.fn();
            const ctx = makeCtx({ setTotalPages: mockSetTotalPages });
            const wrapper = makeWrapper(ctx);
            renderHook(() => useUsuarios(), { wrapper });

            await capturedConfig.queryFn();

            expect(mockSetTotalPages).toHaveBeenCalledWith(undefined);
        });

        it('chama setCount com undefined quando result não tem count', async () => {
            getUsuarios.mockResolvedValue({ results: [] });
            const mockSetCount = jest.fn();
            const ctx = makeCtx({ setCount: mockSetCount });
            const wrapper = makeWrapper(ctx);
            renderHook(() => useUsuarios(), { wrapper });

            await capturedConfig.queryFn();

            expect(mockSetCount).toHaveBeenCalledWith(undefined);
        });

        it('propaga erro como new Error quando getUsuarios rejeita', async () => {
            getUsuarios.mockRejectedValue('timeout');
            const wrapper = makeWrapper(makeCtx());
            renderHook(() => useUsuarios(), { wrapper });

            await expect(capturedConfig.queryFn()).rejects.toThrow('timeout');
        });

        it('propaga erro como new Error quando getUsuarios lança exceção de objeto Error', async () => {
            getUsuarios.mockRejectedValue(new Error('Servidor indisponível'));
            const wrapper = makeWrapper(makeCtx());
            renderHook(() => useUsuarios(), { wrapper });

            await expect(capturedConfig.queryFn()).rejects.toThrow('Error: Servidor indisponível');
        });
    });

    it('retorna isLoading true quando useQuery está carregando', () => {
        useQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
        const wrapper = makeWrapper(makeCtx());
        const { result } = renderHook(() => useUsuarios(), { wrapper });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
    });

    it('retorna isError true quando useQuery reporta erro', () => {
        useQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
        const wrapper = makeWrapper(makeCtx());
        const { result } = renderHook(() => useUsuarios(), { wrapper });

        expect(result.current.isError).toBe(true);
    });
});
