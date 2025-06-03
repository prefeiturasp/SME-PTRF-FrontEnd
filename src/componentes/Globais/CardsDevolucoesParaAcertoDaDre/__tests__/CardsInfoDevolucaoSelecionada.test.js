import { render, screen } from '@testing-library/react'

import CardsInfoDevolucaoSelecionada from '../CardsInfoDevolucaoSelecionada'

const mockData = {
    versao_da_devolucao: '1234',
    devolucao_prestacao_conta: {
        data: '2025-01-01',
        data_limite_ue: '2025-12-31',
        data_retorno_ue: '2025-12-31'
    }
}

describe('CardsInfoDevolucaoSelecionada', ()=>{
    test('Renderiza componente', ()=>{
        render(<CardsInfoDevolucaoSelecionada objetoConteudoCard={mockData}/>)

        expect(screen.getByText('1234')).toBeInTheDocument()

    })
})