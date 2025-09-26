import React, {useState, memo} from 'react';
import AutoCompleteModal from '../../../../Globais/AutoCompleteComponent/AutoCompleteModal';
import { Tag } from '../../../../Globais/Tag';

const AutoCompleteAssociacoes = ({todasAsAssociacoesAutoComplete, recebeAutoComplete, disabled = false, loadingAssociacoes = false}) => {
    const [selectedAssociacao, setSelectedAssociacao] = useState(null);
    const [filteredAssociacoes, setFilteredAssociacoes] = useState(null);

    const searchAssociacao = (event) => {
        setTimeout(() => {
            let filteredAssociacoes;
            if (!event.query.trim().length) {
                filteredAssociacoes = [...todasAsAssociacoesAutoComplete];
            } else {
                filteredAssociacoes = todasAsAssociacoesAutoComplete.filter((associacaoAtiva) => {
                    return associacaoAtiva.nome.toLowerCase().includes(event.query.toLowerCase())
                })
            }
            setFilteredAssociacoes(filteredAssociacoes);
        }, 250);
    };

    const itemTemplate = (item) => {
        if(item.encerrada) {
            return (
                <div className='d-flex' style={{opacity: 0.6}}>
                    <span className='mr-3'>{item.nome}</span>
                    <Tag label='Associação encerrada'/>
                </div>
            )
        } else {
            return item.nome;
        }
    };
    
    const handleChange = (e) => {
        if(e.value.encerrada){
            setSelectedAssociacao(null)
        } else {
            setSelectedAssociacao(e.value)
        }
    };

    const handleSelect = (e) => {
        if(e.value.encerrada){
            recebeAutoComplete(null)
        } else {
            recebeAutoComplete(e.value)
        }        
    };

    return (
        <AutoCompleteModal
            value={selectedAssociacao}
            name='associacao_nome'
            inputId='associacao_nome'
            suggestions={filteredAssociacoes}
            completeMethod={searchAssociacao}
            field="nome"
            onChange={handleChange}
            onSelect={handleSelect}
            itemTemplate={itemTemplate}
            disabled={disabled}
            loading={loadingAssociacoes}
            placeholder=""
            loadingText="Carregando associações"
        />
    )
};

export default memo(AutoCompleteAssociacoes)