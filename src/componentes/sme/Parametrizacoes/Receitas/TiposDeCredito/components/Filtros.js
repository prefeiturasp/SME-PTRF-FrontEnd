import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { getAssociacoesPeloNome } from "../../../../../../services/sme/Parametrizacoes.service";

export const Filtros = ({ filter, setFilter, handleSubmitFormFilter, clearFormFilter, dadosDosFiltros }) => {
    const [loading, setLoading] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [filteredAssociacoes, setFilteredAssociacoes] = useState([]);

    const handleChangeFormFilter = (name, value) => {
        setFilter({
            ...filter,
            [name]: value
        });
    };

    const searchAssociacao = (event) => {
        const query = event.query;
        handleChangeFormFilter("unidades__uuid", query);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            fetchAssociacoes(query);
        }, 2000);

        setDebounceTimeout(newTimeout);
    };

    const fetchAssociacoes = async (nomeBusca) => {
        if (!nomeBusca) return;
        setLoading(true);
        try {
            const response = await getAssociacoesPeloNome(nomeBusca);
            setFilteredAssociacoes(response);
        } catch (error) {
            console.error("Erro ao buscar associações:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="d-flex flex-column bd-highlight my-3 pl-2">
                <div className="row">
                    <form className="col-4">
                        <label htmlFor="nome">Filtrar por nome de crédito</label>
                        <input
                            value={filter.nome}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="nome"
                            id="nome"
                            type="text"
                            className="form-control"
                            placeholder="Busque pelo nome do crédito"
                        />
                    </form>

                    <div className="col-4">
                        <label htmlFor="tipo">Filtrar por tipo</label>
                        <select
                            value={filter.tipo}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="tipo"
                            id="tipo"
                            className="form-control"
                        >
                            <option value="">Selecione</option>
                            {dadosDosFiltros?.tipos?.map((item) => (
                                <option key={item.field_name} value={item.field_name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <form className="col-4">
                        <label htmlFor="classificacao">Filtrar por classificação</label>
                        <select
                            value={filter.classificacao}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="classificacao"
                            id="classificacao"
                            className="form-control"
                        >
                            <option value="">Selecione</option>
                            {dadosDosFiltros?.aceita?.map((item) => (
                                <option key={item.field_name} value={item.field_name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </form>
                </div>

                <div className="row align-items-end mt-3">
                    <div className="col-4">
                        <label htmlFor="tipos_conta__uuid">Filtrar por tipo de conta</label>
                        <select
                            value={filter.tipos_conta__uuid}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="tipos_conta__uuid"
                            id="tipos_conta__uuid"
                            className="form-control"
                        >
                            <option value="">Selecione</option>
                            {dadosDosFiltros?.tipos_contas?.map((item) => (
                                <option key={item.uuid} value={item.uuid}>
                                    {item.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-4">
                      <div className='row'>
                        <label className='col-12' htmlFor="unidades__uuid">Uso associação</label>
                        <AutoComplete
                          className='col-12'
                          value={filter.unidades__uuid}
                          suggestions={filteredAssociacoes}
                          completeMethod={searchAssociacao}
                          field="nome"
                          onChange={(e) => handleChangeFormFilter("unidades__uuid", e.value)}
                          inputClassName="form-control"
                          inputStyle={{
                              borderColor: "#d3d3d3",
                              paddingLeft: "15px",
                          }}
                          placeholder='Digite e selecione'
                        />
                      </div>
                    </div>

                    <div className="col-4 text-end">
                        <div className="d-flex gap-2 justify-content-end">
                            <button onClick={clearFormFilter} className="btn btn-outline-success mr-2">
                                Limpar
                            </button>
                            <button onClick={() => handleSubmitFormFilter(filter)} className="btn btn-success">
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
