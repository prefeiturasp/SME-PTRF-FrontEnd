import React, {useEffect, useState} from "react";
import {useLocation, Redirect} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {Cabecalho} from "../DetalhePrestacaoDeContas/Cabecalho";

export const DetalhePrestacaoDeContasNaoApresentada = () =>{

    const obj_props = useLocation();

    const [prestacaoDeContas, setPrestacaoDeContas] = useState(false);


    useEffect(() => {
        const prestacao_nao_apresentada = localStorage.getItem('prestacao_de_contas_nao_apresentada')

        if(prestacao_nao_apresentada){
            setPrestacaoDeContas(JSON.parse(prestacao_nao_apresentada))
        }

        // Como se fosse o componentWillUnmount - Quando desmonta o componente
        //return () => {}

    }, [])


        /*
        associacao_uuid: "3ebd27dd-62e4-42be-bfd2-748a693c243e"
data_recebimento: null
data_ultima_analise: null
devolucao_ao_tesouro: "0,00"
periodo_uuid: "3dd89f8c-5266-425c-910e-e13ed3f66e10"
processo_sei: ""
status: "NAO_APRESENTADA"
tecnico_responsavel: ""
unidade_eol: "400514"
unidade_nome: "BUTANTA"
uuid: ""
        * */


    /*
    * analises_de_conta_da_prestacao: []
associacao: {uuid: "5b2422b8-3994-416d-a50f-a1adad7154b7", nome: "CEI YVONNE MALUHY JOSEPH SABGA",…}
ccm: ""
cnpj: "06.537.165/0001-83"
email: ""
nome: "CEI YVONNE MALUHY JOSEPH SABGA"
presidente_associacao: {nome: "", email: "", cargo_educacao: ""}
cargo_educacao: ""
email: ""
nome: ""
presidente_conselho_fiscal: {nome: "", email: "", cargo_educacao: ""}
cargo_educacao: ""
email: ""
nome: ""
processo_regularidade: ""
status_regularidade: "PENDENTE"
unidade: {uuid: "01dd84fe-a9db-4363-aa2b-f74846f74739", codigo_eol: "400269", tipo_unidade: "CEI",…}
bairro: ""
cep: ""
codigo_eol: "400269"
complemento: ""
diretor_nome: ""
dre: {uuid: "82b460c6-7b6a-4de6-9376-d66a47f8d6b1", codigo_eol: "108100", tipo_unidade: "DRE",…}
dre_cnpj: ""
dre_designacao_ano: ""
dre_designacao_portaria: ""
dre_diretor_regional_nome: ""
dre_diretor_regional_rf: ""
email: ""
logradouro: ""
nome: "DIRET YVONE MALUHY JOSEPF SABGA"
numero: ""
qtd_alunos: 0
sigla: ""
telefone: ""
tipo_logradouro: ""
tipo_unidade: "CEI"
uuid: "01dd84fe-a9db-4363-aa2b-f74846f74739"
uuid: "5b2422b8-3994-416d-a50f-a1adad7154b7"
data_recebimento: null
data_ultima_analise: null
devolucao_ao_tesouro: "Não"
devolucoes_ao_tesouro_da_prestacao: []
devolucoes_da_prestacao: []
periodo_uuid: "3dd89f8c-5266-425c-910e-e13ed3f66e10"
processo_sei: ""
ressalvas_aprovacao: ""
status: "EM_ANALISE"
tecnico_responsavel: null
uuid: "0112a7bc-98e3-4ab7-b64e-c43db2fdbb67"
    * */

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                    <>
                        {prestacaoDeContas &&
                            <Cabecalho
                                prestacaoDeContas={prestacaoDeContas}
                                exibeSalvar={false}
                            />
                        }

                    </>

            </div>
        </PaginasContainer>
    )
};