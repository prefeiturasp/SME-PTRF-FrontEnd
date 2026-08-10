import { memo } from "react"

export const Manifestacoes = memo(({dadosAta, paaRetificacao,tabelas, isLoading }) => {
    return (
        <div className="col-12 mt-4">
            {dadosAta.comentarios &&
                <>
                    <h4 style={{ fontWeight: "bold", fontSize: "20px", color: "#42474A" }}>Manifestações</h4>
                    <p className="mt-3">{dadosAta.comentarios}</p>
                </>
            }
        </div>
    )
})
