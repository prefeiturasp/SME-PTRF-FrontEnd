import React, {useState, memo} from 'react';
import AutoCompleteModal from '../../../../Globais/AutoCompleteComponent/AutoCompleteModal';
import { Tag } from '../../../../Globais/Tag';

const AutoCompleteAssociacoes = ({todasAsAcoesAutoComplete, recebeAcaoAutoComplete, disabled = false, loadingAssociacoes = false}) => {
    const [selectedAcao, setSelectedAcao] = useState(null);
    const [filteredAcoes, setFilteredAcoes] = useState(null);

    const searchAcao = (event) => {
        setTimeout(() => {
            let filteredAcoes;
            if (!event.query.trim().length) {
                filteredAcoes = [...todasAsAcoesAutoComplete];
            } else {
                filteredAcoes = todasAsAcoesAutoComplete.filter((acaoAtiva) => {
                    return acaoAtiva.unidade.nome_com_tipo.toLowerCase().includes(event.query.toLowerCase())
                })
            }
            setFilteredAcoes(filteredAcoes);
        }, 250);
    };

    const itemTemplate = (item) => {
        if(item.encerrada) {
            return (
                <div className='d-flex' style={{opacity: 0.6}}>
                    <span className='mr-3'>{item.unidade.nome_com_tipo}</span>
                    <Tag label='Associação encerrada'/>
                </div>
            )
        } else {
            return item.unidade.nome_com_tipo;
        }
    };
    
    const handleChange = (e) => {
        if(e.value.encerrada){
            setSelectedAcao(null)
        } else {
            setSelectedAcao(e.value)
        }
    };

    const handleSelect = (e) => {
        if(e.value.encerrada){
            recebeAcaoAutoComplete(null)
        } else {
            recebeAcaoAutoComplete(e.value)
        }        
    };

    return (
        <AutoCompleteModal
            value={selectedAcao}
            name='selectedAcao'
            inputId='selectedAcao'
            suggestions={filteredAcoes}
            completeMethod={searchAcao}
            field="unidade.nome_com_tipo"
            onChange={handleChange}
            onSelect={handleSelect}
            itemTemplate={itemTemplate}
            disabled={disabled}
            loading={loadingAssociacoes}
            placeholder=""
            loadingText="Carregando unidades"
        />
    )
};

export default memo(AutoCompleteAssociacoes)