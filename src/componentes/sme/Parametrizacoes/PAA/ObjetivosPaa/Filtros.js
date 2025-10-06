import {useContext, useState} from "react";
import { ObjetivosPaaContext } from "./context/index";

export const Filtros = () => {

    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContext(ObjetivosPaaContext)
    const [formFilter, setFormFilter] = useState(initialFilter);

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFormFilter = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        setFirstPage(0)
        setFilter(formFilter);
    };

    const clearFilter = () => {
        setCurrentPage(1)
        setFirstPage(0)
        setFormFilter(initialFilter);
        setFilter(initialFilter);
    };

    const onKeyDown = (keyEvent) =>{
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
            handleSubmitFormFilter(keyEvent)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmitFormFilter} onKeyDown={onKeyDown}>
                <div className="d-flex bd-highlight align-items-end mt-2">
                    <div className="p-2 flex-grow-1 bd-highlight">
                        <span className='mr-5'><label htmlFor="nome">Filtrar por nome do objetivo</label></span>
                        <input
                            data-qa="input-filtro-nome"
                            data-testid="input-filtro-nome"
                            value={formFilter.nome}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='nome'
                            id="nome"
                            type="text"
                            maxLength={150}
                            className="form-control w-100"
                            placeholder='Digite o nome do objetivo'
                            style={{display: 'inline-block'}}
                        />
                    </div>
                    <div className="pt-2 pb-2 pr-0 pl-2 bd-highlight">
                        <button onClick={clearFilter} className="btn btn-outline-success">
                            Limpar
                        </button>
                    </div>
                    <div className="p-2 bd-highlight">
                        <button className="btn btn-success" type="submit">
                            Filtrar
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}