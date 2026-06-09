import React, { useState} from "react";
import { Select, Switch } from "antd";
import { AutoComplete } from "primereact/autocomplete";
import { useComissoesContext } from "../hooks/useComissoesContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { getComissoesPorNome } from "../../../../../../services/sme/Parametrizacoes.service";
import "../styles/filtros.scss";

export const Filtros = ({ stateFiltros, handleChangeFiltros, handleSubmitFiltros, handleLimparFiltros }) => {
    const { recursos } = useRecursoSelecionadoContext();

    const { setFilter, initialFilter } = useComissoesContext();
    const [formFilter, setFormFilter] = useState(initialFilter);

    const [comissoes, setComissoes] = useState([]);
    const [loadingComissoes, setLoadingComissoes] = useState(false);

    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const carregarComissoes = async (nome) => {
        try {
            setLoadingComissoes(true);
            const data = await getComissoesPorNome(nome);
            const comissoesUuids = formFilter.comissoes_uuid.map(c => c.uuid);
            const filteredData = data.filter(comissao => !comissoesUuids.includes(comissao.uuid));
            setComissoes(filteredData);
        } catch (error) {
            console.error('Erro ao carregar comissões:', error);
        } finally {
            setLoadingComissoes(false);
        }
    };

    const searchComissoes = (event) => {
        const query = event.query;

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            carregarComissoes(query);
        }, 2000);

        setDebounceTimeout(newTimeout);
    };

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const selectedItemTemplate = (value) => {
        if (!value) return null;
        return (
            <span
                style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block'
                }}
            >
                {value.nome || value}
            </span>
        );
    };

    const clearFilter = () => {
        setFormFilter(initialFilter);
        setFilter(initialFilter);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFilter(formFilter);
    }
    
    return (
        <div className="mb-4">
            <div className="bd-highlight mr-4">
                <p>Filtre por comissão, recursos disponíveis ou por comissões aptas para prestação de contas.</p>
                <form onSubmit={handleSubmitForm} id="form-filtros-motivos-reprovacao-pc" data-qa="form-filtros-motivos-reprovacao-pc">
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="filtro-nome">Filtre por comissão</label>
                            <AutoComplete
                                multiple
                                className='col-12'
                                value={formFilter.comissoes_uuid}
                                suggestions={comissoes}
                                completeMethod={searchComissoes}
                                field="nome"
                                onChange={(e) => handleChangeFormFilter("comissoes_uuid", e.value)}
                                inputClassName="w-100"
                                placeholder='Digite o nome da comissão...'
                                itemTemplate={(item) => <span>{item.nome}</span>}
                                selectedItemTemplate={selectedItemTemplate}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="recurso">Filtre por recurso</label>
                            <Select
                                value={formFilter.recursos_uuid || []}
                                onChange={(values) => handleChangeFormFilter('recursos_uuid', values)}
                                options={recursos?.map(r => ({ label: r.nome, value: r.uuid }))}
                                mode="multiple"
                                id="recursos"
                                placeholder="Selecione um ou mais recursos"
                                style={{ width: '100%', color: 'white' }}
                            />
                            <small className="text-muted d-block mt-2">
                                Se necessário, selecione mais de uma opção.
                            </small>
                        </div>

                        <div className='col-12 mt-3'>
                            <div className="form-group d-flex align-items-center p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                <div className="mr-3">
                                    <Switch 
                                        checked={formFilter.responsavel_analise_pc || false}
                                        onChange={(checked) => handleChangeFormFilter('responsavel_analise_pc', checked)}
                                        // disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                </div>
                                <div>
                                    <p className="text-muted mb-0" style={{ fontSize: "0.95rem", color: "black" }}>
                                        Filtrar por comissões que sejam responsáveis pela análise de prestação de contas
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
            <div className="d-flex justify-content-end mt-3">
                <button
                    type="submit"
                    form="form-filtros-motivos-reprovacao-pc"
                    className="btn btn-success mr-2"
                >
                    Filtrar
                </button>
                
                <button
                    type="button"
                    onClick={clearFilter}
                    className="btn btn-outline-success mr-3"
                >
                    Limpar
                </button>
            </div>
        </div>
    )
}