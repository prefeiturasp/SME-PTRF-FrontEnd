import React, {useState} from "react";

export const FiltroDeUnidades = ({stateFiltros, handleSubmitFiltros, limpaFiltros, filtroInicial}) =>{
    const [filtros, setFiltros] = useState(stateFiltros);

    const handleChangeFiltros = (name, value) => {
        setFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleLimpaFiltros = () => {
        setFiltros(filtroInicial)
        limpaFiltros()
    }

    return(
        <>
            <form onSubmit={(event) => handleSubmitFiltros(event, filtros)}>
                <div className="row">
                    <div className="col-12 col-md-12">
                        <label htmlFor="unidade_escolar_ou_associacao">Buscar por nome ou código EOL da unidade</label>
                        <input
                            value={filtros.nome_ou_codigo}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="nome_ou_codigo"
                            type="text"
                            className="form-control"
                            placeholder="Escreva o nome ou código que deseja procurar..."
                        />
                    </div>
                </div>
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button onClick={()=>handleLimpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button type="bu" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};
