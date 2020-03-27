import React, {useState, createContext} from "react";

export const DadosDoGastoContext = createContext( {
    dadosDoGasto: [],
    inputFields: [],
    setDadosDoGasto(){},
    setInputFields(){},
    handleAddFields(){},
    handleRemoveFields(){},
    handleInputChange(){},
    limpaFormulario(){},
});

export const DadosDoGastoContextProvider = ({children}) => {

    const [dadosDoGasto, setDadosDoGasto] = useState({
        // Custeio
        associacao: "DADOS DO GASTO - 07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
        aplicacao_recurso: "",
        tipo_aplicacao_recurso: 1,
        tipo_custeio: 1,
        especificacao_material_servico:"",
        conta_associacao:"conta1",
        acao_associacao:"",
        valor_rateio:'',
        //Capital
        quantidade_itens_capital:'',
        valor_item_capital:'',
        numero_processo_incorporacao_capital:"",
    })

    const [inputFields, setInputFields] = useState([
        {  // Custeio
            associacao: "INPUT FIELDS - 07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
            aplicacao_recurso: "",
            tipo_aplicacao_recurso: 1,
            tipo_custeio: 1,
            especificacao_material_servico:"",
            conta_associacao:"conta1",
            acao_associacao:"",
            valor_rateio:'',
            //Capital
            quantidade_itens_capital:'',
            valor_item_capital:'',
            numero_processo_incorporacao_capital:"", }
    ]);

    const handleAddFields = () => {
        const values = [...inputFields];
        values.push({  // Custeio
            associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
            aplicacao_recurso: "",
            tipo_aplicacao_recurso: 1,
            tipo_custeio: 1,
            especificacao_material_servico:"",
            conta_associacao:"conta1",
            acao_associacao:"",
            valor_rateio:'',
            //Capital
            quantidade_itens_capital:'',
            valor_item_capital:'',
            numero_processo_incorporacao_capital:"", });
        setInputFields(values);
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
    };

    const handleInputChange = (index, event) => {
        const values = [...inputFields];
        if (event.target.name === "associacao") {
            values[index].associacao = "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69";
        } else if(event.target.name === "aplicacao_recurso") {
            values[index].aplicacao_recurso = event.target.value;
        }else if(event.target.name === "tipo_aplicacao_recurso") {
            values[index].tipo_aplicacao_recurso = event.target.value;
        }else if(event.target.name === "tipo_custeio") {
            values[index].tipo_custeio = event.target.value;
        }else if(event.target.name === "especificacao_material_servico") {
            values[index].especificacao_material_servico = event.target.value;
        }else if(event.target.name === "conta_associacao") {
            values[index].conta_associacao = event.target.value;
        }else if(event.target.name === "acao_associacao") {
            values[index].acao_associacao = event.target.value;
        }else if(event.target.name === "valor_rateio") {
            values[index].valor_rateio = event.target.value;
        }else if(event.target.name === "quantidade_itens_capital") {
            values[index].quantidade_itens_capital = event.target.value;
        }else if(event.target.name === "valor_item_capital") {
            values[index].valor_item_capital = event.target.value;
        }else if(event.target.name === "numero_processo_incorporacao_capital") {
            values[index].numero_processo_incorporacao_capital = event.target.value;
        }

        setInputFields(values);
    };

    const handleChangeDadosDoGasto = (name, value) => {
        setDadosDoGasto({
            ...dadosDoGasto,
            [name]: value
        });
    };

    const limpaFormulario = ()=>{
        setInputFields([
            {  // Custeio
                associacao: "INPUT FIELDS - 07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
                aplicacao_recurso: "",
                tipo_aplicacao_recurso: 1,
                tipo_custeio: 1,
                especificacao_material_servico:"",
                conta_associacao:"conta1",
                acao_associacao:"",
                valor_rateio:'',
                //Capital
                quantidade_itens_capital:'',
                valor_item_capital:'',
                numero_processo_incorporacao_capital:"", }
        ]);
    }

    return (
        <DadosDoGastoContext.Provider value={
            {
                dadosDoGasto,
                inputFields,
                setDadosDoGasto,
                setInputFields,
                handleChangeDadosDoGasto,
                handleAddFields,
                handleRemoveFields,
                handleInputChange,
                limpaFormulario
            } }>
            {children}
        </DadosDoGastoContext.Provider>
    )
}