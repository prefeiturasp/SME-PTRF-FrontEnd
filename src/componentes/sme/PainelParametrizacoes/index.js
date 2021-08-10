import React from "react";
import "./parametrizacoes.scss"
import {ParametrizacaoCard} from "./ParametrizacaoCard";
import IconeAssociacoes from "../../../assets/img/icone-parametro-associacoes.svg"
import IconeAcoesAssociacoes from "../../../assets/img/icone-parametro-acoes-associacoes.svg"
import IconeContasAssociacoes from "../../../assets/img/icone-parametro-contas-associacoes.svg"
import IconePeriodos from "../../../assets/img/icone-parametro-periodos.svg"
import IconeTags from "../../../assets/img/icone-parametro-tags.svg"
import IconeTiposAcao from "../../../assets/img/icone-parametro-tipos-acao.svg"
import IconeTiposConta from "../../../assets/img/icone-parametro-tipos-conta.svg"
import IconeEspecificacoes from "../../../assets/img/icone-parametro-especificacoes.svg"
import IconeTiposCusteio from "../../../assets/img/icone-parametro-tipos-custeio.svg"
import IconeTiposDocumento from "../../../assets/img/icone-parametro-tipos-documento.svg"
import IconeTiposTransacao from "../../../assets/img/icone-parametro-tipos-transacao.svg"
import IconeTiposReceita from "../../../assets/img/icone-parametro-tipos-receita.svg"
import IconeUsuarios from "../../../assets/img/icone-parametro-usuarios.svg"
import IconeTextosFiqueDeOlho from "../../../assets/img/icone-parametro-textos-fique-de-olho.svg"
import IconeFornecedores from "../../../assets/img/icone-parametro-fornecedores.svg"

export const PainelParametrizacoes = () => {

    const itensParametrizacaoEstrutura = [
        {
            parametro: 'Associações',
            url: 'parametro-associacoes',
            icone: IconeAssociacoes,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Ações das Associações',
            url: 'parametro-acoes-associacoes',
            icone: IconeAcoesAssociacoes,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Contas das Associações',
            url: 'parametro-contas-associacoes',
            icone: IconeContasAssociacoes,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Períodos',
            url: 'parametro-periodos',
            icone: IconePeriodos,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Etiquetas/Tags',
            url: 'parametro-tags',
            icone: IconeTags,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Ações',
            url: 'parametro-acoes',
            icone: IconeTiposAcao,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Tipos de Conta',
            url: 'parametro-tipos-conta',
            icone: IconeTiposConta,
            permissoes: ['access_painel_parametrizacoes'],
        }
    ];

    const itensParametrizacaoDespesas = [
        {
            parametro: 'Especificações',
            url: 'parametro-especificacoes',
            icone: IconeEspecificacoes,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Tipos de despesa de custeio',
            url: 'parametro-tipos-custeio',
            icone: IconeTiposCusteio,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Tipos de Documento',
            url: 'parametro-tipos-documento',
            icone: IconeTiposDocumento,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Tipos de Transação',
            url: 'parametro-tipos-transacao',
            icone: IconeTiposTransacao,
            permissoes: ['access_painel_parametrizacoes'],
        },
        {
            parametro: 'Fornecedores',
            url: 'parametro-fornecedores',
            icone: IconeFornecedores,
            permissoes: ['access_fornecedores'],
        }
    ];

    const itensParametrizacaoReceitas = [
        {
            parametro: 'Tipos de Receita',
            url: 'parametro-tipos-receita',
            icone: IconeTiposReceita,
            permissoes: ['access_painel_parametrizacoes'],
        }
    ];

    const itensParametrizacaoEdicaoDeTexto = [
        {
            parametro: 'Textos do Fique de Olho',
            url: 'parametro-textos-fique-de-olho',
            icone: IconeTextosFiqueDeOlho,
            permissoes: ['access_painel_parametrizacoes'],
        }
    ];

    const itensParametrizacaoGestaoSme = [
        {
            parametro: 'Usuários',
            url: 'parametro-arquivos-de-carga/CARGA_USUARIOS/',
            icone: IconeUsuarios,
            permissoes: ['access_painel_parametrizacoes'],
        }
    ];

    return (
        <>
            <ParametrizacaoCard
                itensParametrizacao={itensParametrizacaoEstrutura}
                nomeGrupo='Estrutura'
            />
            <ParametrizacaoCard
                itensParametrizacao={itensParametrizacaoDespesas}
                nomeGrupo='Despesas'
            />
            <ParametrizacaoCard
                itensParametrizacao={itensParametrizacaoReceitas}
                nomeGrupo='Receitas'
            />
            <ParametrizacaoCard
                itensParametrizacao={itensParametrizacaoEdicaoDeTexto}
                nomeGrupo='Edição de texto'
            />
            <ParametrizacaoCard
                itensParametrizacao={itensParametrizacaoGestaoSme}
                nomeGrupo='Gestão SME'
            />
        </>
    )
};