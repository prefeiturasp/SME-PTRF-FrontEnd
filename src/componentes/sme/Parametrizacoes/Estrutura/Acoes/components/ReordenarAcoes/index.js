import { PaginasContainer } from "../../../../../../../paginas/PaginasContainer"

export const ReordenarAcoes = () => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Ações</h1>
      <div className="page-content-inner">
        <h4 className="titulo-itens-painel">Alterar ordenação</h4>
        <p>Arraste o ícone ao lado de cada ação para reorganizar a ordem. A ordenação
          será exibida em todas as listas de ações para as UEs vinculadas.
        </p>
      </div>
    </PaginasContainer>
  )
}