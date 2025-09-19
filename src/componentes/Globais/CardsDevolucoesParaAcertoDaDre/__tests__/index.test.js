import { screen, render, waitFor, fireEvent } from '@testing-library/react'
import { getAnalisesDePcDevolvidas } from '../../../../services/dres/PrestacaoDeContas.service'
import CardsDevolucoesParaAcertoDaDre from '../index'
import { mantemEstadoAnaliseDre } from "../../../../services/mantemEstadoAnaliseDre.service";

import {exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";

require("ordinal-pt-br");

jest.mock("../../../../utils/ValidacoesAdicionaisFormularios", ()=>({
    exibeDataPT_BR: jest.fn()
}));

jest.mock('../../../../services/mantemEstadoAnaliseDre.service', ()=> ({
    mantemEstadoAnaliseDre: {
        getAnaliseDreUsuarioLogado: jest.fn(),
        limpaAnaliseDreUsuarioLogado: jest.fn(),
        setAnaliseDrePorUsuario: jest.fn()
    }
}));

jest.mock('../../../../services/dres/PrestacaoDeContas.service', ()=> ({
    getAnalisesDePcDevolvidas: jest.fn()
}))

const mockData = {
    prestacao_conta_uuid: '1234', 
    analiseAtualUuid: false, 
    setAnaliseAtualUuid: jest.fn(), 
    setPermitirTriggerOnclick: null,
    devolucao_atual: {
        uuid: '987654'
    },
    setDevolucaoAtualSelecionada: null
}

const mockAnalises = [
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
    {
        devolucao_prestacao_conta: {
            data: '2025-01-01'
        }
    },
]

const mockUsuarioLogado = {
    analise_pc_uuid: '123456789',
    
}

describe('CardsDevolucoesParaAcertoDaDre', ()=>{

    test('Renderiza componente', async () => {
        getAnalisesDePcDevolvidas.mockResolvedValue({ data: mockAnalises })
        mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado.mockReturnValue(mockUsuarioLogado)

        render(<CardsDevolucoesParaAcertoDaDre {...mockData} />)

        const campo = await screen.findByTestId('select-filtro-ajuste')

        expect(campo).toBeInTheDocument()
        expect(getAnalisesDePcDevolvidas).toHaveBeenCalled()
        expect(mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado).toHaveBeenCalled()
    })

    test('Renderiza componente', async ()=>{
        getAnalisesDePcDevolvidas.mockReturnValue([])
        mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado.mockReturnValue(mockUsuarioLogado)

        render(<CardsDevolucoesParaAcertoDaDre {...mockData}/>)
        
        await waitFor(() => {
            expect(screen.queryByText('Carregando...')).not.toBeInTheDocument()
        })
        
        await waitFor(() => {
            const campo = screen.getByTestId('select-filtro-ajuste')
            expect(campo).toBeInTheDocument()
            expect(getAnalisesDePcDevolvidas).toHaveBeenCalled()
            expect(mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado).toHaveBeenCalled()
        })
    })

    it('Renderiza componente', async ()=>{
        getAnalisesDePcDevolvidas.mockReturnValue(mockAnalises)
        mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado.mockReturnValue(mockUsuarioLogado)

        render(<CardsDevolucoesParaAcertoDaDre {...mockData}/>)
        
        expect(screen.queryByText('Carregando...')).toBeInTheDocument()
        
        await waitFor(() => {
            const campo = screen.getByTestId('select-filtro-ajuste')
            console.log(campo.innerHTML)
            expect(campo).toBeInTheDocument()
            fireEvent.change(campo, {target: {value: '5678', selectedIndex: 0}})
        })
    })
})