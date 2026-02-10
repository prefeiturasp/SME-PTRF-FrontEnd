import { useState } from 'react';
import { Table, Typography } from 'antd';
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useGetResumoPrioridades } from './hooks/useGetResumoPrioridades';

export const Resumo = () => {

    // Controlar as linhas expandidas
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const { isFetching: isLoadingResumoPrioridades, resumoPrioridades } = useGetResumoPrioridades();

    const renderTipoRecurso = (text, record) => {
        // Se for PTRF Total ou filho de PTRF Total, aplica a cor de PTRF
        const isPTRF = record.recurso === 'PTRF Total' || record.parent === 'PTRF';
        // Se for PDDE Total ou filho de PDDE Total, aplica a cor de PDDE
        const isPDDE = record.recurso === 'PDDE Total' || record.parent === 'PDDE';
        // Se for Recursos proprios ou filho de Recursos próprios, aplica a cor de RECURSO_PROPRIO
        const isRECURSO_PROPRIO = record.recurso === 'Recursos Próprios' || record.parent === 'RECURSO_PROPRIO';

        
        const CORES = {
            'PTRF': '#2B7D83',
            'PDDE': '#5151CF',
            'RECURSO_PROPRIO': '#870051',
            'OUTRO_RECURSO': '#870051'
        }
        // Define o índice da cor de acordo com o recurso e aplica no dicionário CORES
        const tipoRecursoLinha = isPTRF
        ? 'PTRF'
        : isPDDE
            ? 'PDDE'
            : isRECURSO_PROPRIO
            ? 'RECURSO_PROPRIO'
            : record.key === 'OUTRO_RECURSO'
                ? 'OUTRO_RECURSO'
                : '';

        const consideraNegrito = (
            // Considera negrito os recursos do primeiro e terceiro nível
            [0,2].includes(record.level) ||
            // Considera negrito os recursos que estiverem expandidos
            expandedRowKeys.includes(record.key)
        );
        return (
            <span style={{
                color: CORES[tipoRecursoLinha] || record.cor || '#333333',
                fontWeight: consideraNegrito ? 'bold' : 'normal',
                paddingLeft: `${record.level * 15}px`, // px por nível
                // manter a quebra de linha identada à primeira linha (aplicação do padding acima)
                // para casos com quebra de linha devido ao tamanho da string
                display: 'flex',
            }}>
                {text}
            </span>
        );
    }
    
    const valoresStyle = (value, record) => {
        const consideraNegrito = (
            // Considera negrito os recursos do primeiro nível
            record.level === 0 ||
            // Considera negrito os valores que estiverem expandidos
            expandedRowKeys.includes(record.key) ||
            // Considera negrito os valores de Saldo
            record.recurso === 'Saldo'
        );
        return (
            <span style={{
                color: '#42474A',
                fontWeight: consideraNegrito ? 'bold' : 'normal'
            }}>
                {/* Considera "-" quando o valor é zero */}
                {!value ? '-' : value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
        )
    }

    // Definição das colunas
    const columns = [
        {
            title: 'Tipos de recursos',
            dataIndex: 'recurso',
            key: 'recurso',
            align: 'left',
            render: renderTipoRecurso
        },
        {
            title: 'Custeio (R$)',
            dataIndex: 'custeio',
            key: 'custeio',
            width: 130,
            align: 'center',
            render: valoresStyle,
        },
        {
            title: 'Capital (R$)',
            dataIndex: 'capital',
            key: 'capital',
            width: 130,
            align: 'center',
            render: valoresStyle,
        },
        {
            title: 'Livre Aplicação (R$)',
            dataIndex: 'livre_aplicacao',
            key: 'livre_aplicacao',
            width: 155,
            align: 'center',
            render: valoresStyle,
        },
        {   // Coluna de expandir
            title: '',
            dataIndex: 'expand',
            key: 'expand',
            width: 35,
            render: () => null,
            align: 'center',
        },
    ];

    // Lista dos dados de resumo de Prioridades
    const data = resumoPrioridades;

    const handleExpand = (expanded, record) => {
        /**
         * Controlar as linhas expandidas
         * Considerando que ao expandir cada level 0, os itens level 1 devem ser exibidos
         * Para cada level 1, deve ser exibido os respectivos level 2
         * somente 1 item de level 1 pode estar expandido por vez 
        */

        // Verifica se a linha atual eh o level 0 (PTRF, PDDE ou RECURSO_PROPRIO)
        const isLevel0 = record.level === 0;

        if (isLevel0) {
            // Condição criada para redefinir as rowkey quando um level 0 for expandido, 
            // dessa forma, somente um parent de cada vez será expandido
            setExpandedRowKeys(expanded ? [record.key] : []);
        } else {
            if (expandedRowKeys.includes(record.key)) {
                // se um filho já estiver na lista, ele deve ser removido
                setExpandedRowKeys((prev) => [...prev.filter((id) => id !== record.key)]);
            }else{
                // condição para que, além dos respectivos parents, todos os filhos consigam expandir
                setExpandedRowKeys([record.parent, record.key]);
            }
        }
    };

    const handleExpandIcon = ({ expanded, onExpand, record }) => {
        /** Define os ícones de Expandido e Recolhido */

        if (!record.children || record.children.length === 0) {
            // não mostra nada se não tiver filhos (children)
            return null;
        }

        return expanded ? (
            // Se estiver expandido, mostra o icone de recolher (seta para cima)
            <UpOutlined
                style={{ cursor: "pointer",  fontSize: '18px' }}
                onClick={(e) => onExpand(record, e)}
            />
        ) : (
            // Se estiver recolhido, mostra o icone de expandir (seta para baixo)
            <DownOutlined
                style={{ cursor: "pointer",  fontSize: '18px' }}
                onClick={(e) => onExpand(record, e)}
            />
        );
    }

    const definirCoresLinhas = (record) => {
        if (record.level === 0) {
            // Linhas de Totais do level 0 (Recursos Próprios, PDDE Total e PTRF Total)
            return {
                style: { backgroundColor: '#EEECEC' }
            }
        }

        if (record.level === 1) {
            // Linhas de level 2
            // Sem customização de cor
        }
        
        if (record.level === 2) {
            // Linhas de level 3 (receita, despesas previstas e saldo)
            return {
                style: { backgroundColor: '#FAFAFA' }
            }
        }
        // Retorno padrão
        return {
            style: { backgroundColor: 'inherit' }
        }
    }

    const definirNivel = (nodes, level = 0) => {
        /**
         * Função para definir o nível de cada linha
         * Isso facilita o controle de lógicas de cada nível para regras de negócio (cores, expandir, etc)
         * level = 0: Outros Recursos, PDDE Total e PTRF Total
         * level = 1: itens de cada level 0 (Outros Recursos, PDDE Total e PTRF Total)
         * level = 2: resumo de valores de level 1 (receita, despesas previstas e saldo)
         */
        const niveis = nodes.map((node) => {
            const newNode = { ...node, level };
            if (node.children) {
            newNode.children = definirNivel(node.children, level + 1);
            }
            return newNode;
        });

        return niveis
    };

    const overrideTableHeader = (props) => {
        // Customiza o Header da tabela, conforme protótipo
        return (
            <td {...props} className="" style={{
                ...(props.style || {}), // dessa forma, mantemos o estilo original definido na const columns
                borderColor: '#dadada', // Customizar a cor da borda para um tom mais contraste no header
                fontWeight: 'bold', // define a fonte em negrito
                color: 'var(--color-primary)', // define a cor do header
                padding: '8px', // mantém padding original
            }} />
        );
    };

    const overrideTableBody = (props) => {
        // Customiza o Body da tabela, conforme protótipo
        return (
            <td {...props} style={{
                ...(props.style || {}), // dessa forma, mantemos o estilo original definido na const columns
                borderColor: '#dadada', // Customizar a cor da borda para um tom mais contraste
                padding: '6px', // definir um padding menor
                textAlign: 'end',
            }} />
        );
    };

    const dataNiveis = definirNivel(data); 

    return (
        <>
            <Typography.Title level={5} className='my-4'>
                Resumo de recursos
            </Typography.Title>

            <Table
                loading={isLoadingResumoPrioridades}
                bordered
                sticky={{ offsetHeader: 80 }}
                style={{ border: '1px solid #dadada', borderRadius: '4px' }}
                onRow={definirCoresLinhas}
                pagination={false}
                columns={columns}
                dataSource={dataNiveis}
                components={{
                    header: { cell: (props) => overrideTableHeader(props) },
                    body: { cell: (props) => overrideTableBody(props)},
                }}
                expandable={{
                    expandedRowKeys,
                    onExpand: handleExpand,
                    expandIconColumnIndex: columns.length - 1,
                    expandIcon: handleExpandIcon,
                }}
            />
        </>
    )

};
