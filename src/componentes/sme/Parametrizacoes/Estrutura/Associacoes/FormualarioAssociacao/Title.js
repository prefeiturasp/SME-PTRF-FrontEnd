import { useAssociacoesFormularioContext } from "../hooks/useAssociacoesFormularioContext"

export function Title() {
    const { uuid } = useAssociacoesFormularioContext();

    return (
        <h1 className="titulo-itens-painel mt-5">{uuid ? 'Atualizar' : 'Adicionar'} Associação</h1>
    )
}
