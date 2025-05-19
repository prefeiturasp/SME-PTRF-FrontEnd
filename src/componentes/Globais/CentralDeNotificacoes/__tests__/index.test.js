import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CentralDeNotificacoes  } from '../index'
import { mockNotificacoes, mockTiposNotificacoes } from '../__fixtures__/mockData';
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
        getNotificacoesTabela.mockReturnValue({tipos_notificacao: mockTiposNotificacoes})
        renderComponent()

        await waitFor(()=>{
            const selectTipoNotificacao = screen.getByLabelText('Por tipo de notificação')
            fireEvent.change(selectTipoNotificacao, {target: {value: '2'}})
            expect(selectTipoNotificacao.value).toBe('2')
            fireEvent.click(screen.getByText('Filtrar'))
        })

        expect(getNotificacoes).toHaveBeenCalled()
        expect(getNotificacoesTabela).toHaveBeenCalled()
        expect(getNotificacoesFiltros).toHaveBeenCalled()
    })

    
    test('renderiza Componente, chama filtros', async ()=> {
        getNotificacoes.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})
        getNotificacoesFiltros.mockReturnValue({results: mockNotificacoes, count: mockNotificacoes.length})
        getNotificacoesTabela.mockReturnValue({tipos_notificacao: mockTiposNotificacoes})
        renderComponent()
        expect(screen.getByText('Não existem notificações a serem exibidas')).toBeInTheDocument()
        
        await waitFor(()=>{
            fireEvent.click(screen.getByText('Limpar Filtros'))
            fireEvent.click(screen.getByText('Filtrar'))
        })
        expect(getNotificacoes).toHaveBeenCalledTimes(2)
        expect(getNotificacoesFiltros).toHaveBeenCalledTimes(1)
    })
})