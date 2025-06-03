import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CentralDeNotificacoes  } from '../index'
import {
    mockNotificacoes,
    mockTiposNotificacoes,
    mockTabelaNotificacoes
} from '../__fixtures__/mockData';
import {
    getNotificacoes,
    getNotificacoesFiltros,
    getNotificacoesTabela,
    getNotificacoesLidasNaoLidas,
    getNotificacoesLidasNaoLidasPaginacao
} from "../../../../services/Notificacoes.service";
import moment from 'moment'

jest.mock('moment', () => ({
    default: jest.fn(() => ({
}))}));

jest.mock("../../../../services/Notificacoes.service");


describe('CentralDeNotificacoes', () => {
    const renderComponent = ()=> (render(<>
            <CentralDeNotificacoes/>
        </>
    ))

    beforeEach(()=>{
        jest.clearAllMocks()
    })

    test('testa a chamada dos handles', async ()=> {
        getNotificacoes.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})
        getNotificacoesFiltros.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})
        getNotificacoesTabela.mockReturnValue(mockTabelaNotificacoes)
        renderComponent()

        await waitFor(()=>{
            const selectTipoNotificacao = screen.getByLabelText('Por tipo de notificação')

            const id_novo_tipo = mockTabelaNotificacoes.tipos_notificacao[0].id

            fireEvent.change(selectTipoNotificacao, {target: {value: id_novo_tipo}})
            expect(selectTipoNotificacao.value).toBe(id_novo_tipo)
            fireEvent.click(screen.getByText('Filtrar'))
        })

        expect(getNotificacoes).toHaveBeenCalled()
        expect(getNotificacoesTabela).toHaveBeenCalled()
        expect(getNotificacoesFiltros).toHaveBeenCalled()
    })

    test('renderiza Componente, chama filtros', async ()=> {
        getNotificacoes.mockReturnValue({results: [], count: 0})
        getNotificacoesFiltros.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})
        getNotificacoesTabela.mockReturnValue(mockTabelaNotificacoes)
        renderComponent()
        expect(screen.getByText('Não existem notificações a serem exibidas')).toBeInTheDocument()

        await waitFor(()=>{
            fireEvent.click(screen.getByText('Limpar Filtros'))
            fireEvent.click(screen.getByText('Filtrar'))
        })
        expect(getNotificacoes).toHaveBeenCalledTimes(2)
        expect(getNotificacoesFiltros).toHaveBeenCalledTimes(1)
    })

    test('renderiza Chama Botão Lidas', async ()=> {
        getNotificacoes.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})
        getNotificacoesLidasNaoLidas.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})

        renderComponent()
        expect(screen.getByText('Lidas')).toBeInTheDocument()

        await waitFor(()=>{
            fireEvent.click(screen.getByText('Lidas'))
        })
        expect(getNotificacoes).toHaveBeenCalledTimes(1)
        expect(getNotificacoesLidasNaoLidas).toHaveBeenCalledTimes(1)
        expect(getNotificacoesLidasNaoLidas).toHaveBeenCalledWith("True")
    })

    test('renderiza Chama Botão Não Lidas', async ()=> {
        getNotificacoes.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})
        getNotificacoesLidasNaoLidas.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})

        renderComponent()
        expect(screen.getByText('Não Lidas')).toBeInTheDocument()

        await waitFor(()=>{
            fireEvent.click(screen.getByText('Não Lidas'))
        })
        expect(getNotificacoes).toHaveBeenCalledTimes(1)
        expect(getNotificacoesLidasNaoLidas).toHaveBeenCalledTimes(1)
        expect(getNotificacoesLidasNaoLidas).toHaveBeenCalledWith("False")
    })

    test('renderiza Chama Botão Todas', async ()=> {
        getNotificacoes.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})

        renderComponent()
        expect(screen.getByText('Todas')).toBeInTheDocument()

        await waitFor(()=>{
            fireEvent.click(screen.getByText('Todas'))
        })
        expect(getNotificacoes).toHaveBeenCalledTimes(2)
    })

    test('renderiza toggle notificacoes', async ()=> {
        getNotificacoes.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})
        getNotificacoesTabela.mockReturnValue({tipos_notificacao: mockTiposNotificacoes})

        renderComponent()
        await waitFor(()=>{
            expect(screen.getByText('Ajustes necessários na PC | Prazo: 09/12/2024')).toBeInTheDocument()
        })
        const toggle = screen.getAllByTestId('botao-toggle-notificacao')
        fireEvent.click(toggle[0])

        expect(getNotificacoes).toHaveBeenCalledTimes(1)
        expect(getNotificacoesTabela).toHaveBeenCalledTimes(1)
    })
})
