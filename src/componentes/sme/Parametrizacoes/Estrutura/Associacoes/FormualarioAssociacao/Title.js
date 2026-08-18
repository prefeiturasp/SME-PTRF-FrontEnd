import { useAssociacoesFormularioContext } from "../hooks/useAssociacoesFormularioContext"

export function Title() {
    const { uuid } = useAssociacoesFormularioContext();

    return (
        <h1 className="titulo-itens-painel mt-5">{uuid ? 'Editar' : 'Adicionar'} Associação</h1>
    )
}
