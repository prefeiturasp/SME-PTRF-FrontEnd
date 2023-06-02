import React from "react";

export const FormFiltroPorEspecificacaoMaterialServico = (props) => {

    const {
        reusltadoSomaDosTotais,
        filtrosAvancados,
        setFiltrosAvancados,
        buscaDespesasOrdenacao,
        setBuscaUtilizandoOrdenacao,
        limparOrdenacao,
        setLoading,
    } = props;

    const handleChange = (name, value) => {
        setFiltrosAvancados({
            ...filtrosAvancados,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        reusltadoSomaDosTotais(filtrosAvancados.filtrar_por_termo);

        buscaDespesasOrdenacao();
        setBuscaUtilizandoOrdenacao(true);
        limparOrdenacao()
    };

    return (
        <form className="form-inline" onSubmit={handleSubmit}>
            <div className="d-flex align-items-center mr-2 mb-2 w-100">
                <input
                    value={filtrosAvancados.filtrar_por_termo}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                    name="filtrar_por_termo" id="filtrar_por_termo" type="text"
                    className="form-control w-100"
                    placeholder="Escreva o termo que deseja filtrar"
                />
                <button type="submit" className="btn btn btn btn-success mr-0 mb-2 ml-md-2 mt-2">Filtrar</button>
            </div>
        </form>
    )

}