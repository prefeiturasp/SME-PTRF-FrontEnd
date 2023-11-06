import React, {useContext} from "react";
import { GestaoDeUsuariosAdicionarUnidadeContext } from "../context/GestaoUsuariosAdicionarUnidadeProvider";
import {useQueryClient} from "@tanstack/react-query";

export const FiltroDeUnidades = () => {
    const queryClient = useQueryClient()
    const { search, setSearch, setSubmitFiltro, setFirstPage, setCurrentPage, currentPage } = useContext(GestaoDeUsuariosAdicionarUnidadeContext);

    const handleChangeFormFilter = (value) => {
        setSubmitFiltro(false);
        setSearch(value);
    };

    const handleSubmitFiltros = (event)=>{
        event.preventDefault();

        if(search !== ''){
            setFirstPage(1);
            setCurrentPage(1);
            setSubmitFiltro(true);
            queryClient.invalidateQueries(['unidades-disponiveis-inclusao', currentPage]).then()
        }
    };

    const handleLimparFiltro = () => {
        setSearch('')
        // Necessário para sempre que entrar na página de adicionar unidades, a lista inicie vazia
        const query_unidades_disponiveis = queryClient.getQueryData(['unidades-disponiveis-inclusao', currentPage])
        
        if(query_unidades_disponiveis !== undefined){
            query_unidades_disponiveis.count = 0
            query_unidades_disponiveis.results = []
        }
    }

    return(
        <>
            <form className="mt-3" onSubmit={(event) => handleSubmitFiltros(event)}>
                <section className="row">
                    <section className="col-12">
                        <label htmlFor="unidade_escolar_ou_associacao">Buscar por nome ou código EOL da unidade</label>
                        <input
                            value={search}
                            onChange={(e) => handleChangeFormFilter(e.target.value)}
                            name="search"
                            type="text"
                            className="form-control"
                            placeholder="Escreva o nome ou código que deseja procurar..."
                        />
                    </section>
                </section>

                <section className="row">
                    <section className="col-12">
                        <div className="d-flex justify-content-end pb-3 mt-2">
                            <button onClick={()=>handleLimparFiltro()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                            <button type="submit" className="btn btn-success mt-2">Filtrar</button>
                        </div>
                    </section>
                </section>
            </form>
        </>
    )
}