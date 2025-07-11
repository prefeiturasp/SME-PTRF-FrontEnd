import { fireEvent, render, screen } from '@testing-library/react'
import { Paginacao } from '../Paginacao'


jest.mock('react-ultimate-pagination-bootstrap-4', () => (props) => {
    const { currentPage, totalPages, onChange } = props;
    return (
      <div data-testid="pagination">
        <button onClick={() => onChange(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => onChange(currentPage + 1)} disabled={currentPage === totalPages}>Próxima</button>
      </div>
    );
});

describe('Paginacao', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks()
    })
    const props = {
        paginacaoPaginasTotal: 10,
        trazerNotificacoesPaginacao: jest.fn(),
        trazerNotificacoesLidasNaoLidasPaginacao: jest.fn(),
        categoriaLidaNaoLida: 'lidas',
        forcarPrimeiraPagina: jest.fn(),
        usouFiltros: true,
        trazerNotificacoesFiltrosPaginacao: jest.fn(),
    }

    test('renderiza o componente', () => {
        render(<Paginacao {...props} />)
        expect(screen.getByText('Página 1 de 10')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Próxima'))
    })

    test('renderiza o componente com categoria todas', () => {
        const customProps = {...props, ...{categoriaLidaNaoLida: 'todas', usouFiltros: false}}
        render(<Paginacao {...customProps} />)
        expect(screen.getByText('Página 1 de 10')).toBeInTheDocument()
    })

    test('renderiza o componente com categoria nao_lidas', () => {
        const customProps = {...props, ...{categoriaLidaNaoLida: 'nao_lidas', usouFiltros: false}}
        render(<Paginacao {...customProps} />)
        expect(screen.getByText('Página 1 de 10')).toBeInTheDocument()
    })

    test('renderiza o componente com categoria lidas', () => {
        const customProps = {...props, ...{categoriaLidaNaoLida: 'lidas', usouFiltros: false}}
        render(<Paginacao {...customProps} />)
        fireEvent.click(screen.getByText('Próxima'))
        expect(screen.getByText('Página 2 de 10')).toBeInTheDocument()
    })

})
