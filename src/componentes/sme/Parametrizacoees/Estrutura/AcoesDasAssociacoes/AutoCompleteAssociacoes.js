import React, { useState, memo } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

const AutoCompleteAssociacoes = ({todasAsAcoesAutoComplete}) => {
    const [selectedAcao, setSelectedAcao] = useState(null);
    const [filteredAcoes, setFilteredAcoes] = useState(null);

    console.log("AUTOCOMPLETE todasAsAcoesAutoComplete ", todasAsAcoesAutoComplete);

    const searchAcao = (event) => {
        setTimeout(() => {
            let filteredAcoes;
            if (!event.query.trim().length) {
                filteredAcoes = [...todasAsAcoesAutoComplete];
            }
            else {
                filteredAcoes = todasAsAcoesAutoComplete.filter((acaoAtiva) =>{
                    return acaoAtiva.associacao.unidade.nome_com_tipo.toLowerCase().includes(event.query.toLowerCase())
                })
            }
            setFilteredAcoes(filteredAcoes);
        }, 250);
    };

    const handleSubmit = () =>{
        console.log("handleSubmit ", selectedAcao)
    };

    return (
        <form>
            <h5>Basic</h5>
            <AutoComplete
                value={selectedAcao}
                suggestions={filteredAcoes}
                completeMethod={searchAcao}
                field="associacao.unidade.nome_com_tipo"
                onChange={(e) => setSelectedAcao(e.value)}
                inputClassName="form-control"
            />
            <button onClick={handleSubmit} type='button'>Enviar</button>
        </form>
    )
};

export default memo(AutoCompleteAssociacoes)