import React from 'react';
import SelectMultiFiltro from '../../../Globais/SelectMultiFiltro';
import SelectFiltro from '../../../Globais/SelectFiltro';
import './scss/FiltrosPaa.scss';

import type { IFiltrosPaa, ITabelaPaaResponse } from '../../../../interface/dre/Paa/paa.interface';

interface IFiltrosPaaProps {
    tabelaPaa?: ITabelaPaaResponse;
    filtros: IFiltrosPaa;
    aoAlterarFiltro: (nome: IFiltrosPaa | string, valor: string) => void;
    aoSubmeterFiltros: (e?: React.FormEvent<HTMLFormElement>) => void;
    limpaFiltros: () => void;
    tipoUnidadeManual: boolean;
}

export const FiltrosPaa: React.FC<IFiltrosPaaProps> = ({
    tabelaPaa = {
        periodos: [],
        unidades: [],
        tipos_unidade: [],
        status: [],
    },
    filtros,
    aoAlterarFiltro,
    aoSubmeterFiltros,
    limpaFiltros,
    tipoUnidadeManual,
}) => {
    const unidadesFiltradas = (tabelaPaa.unidades || [])
        .filter((u) => {
            if (!tipoUnidadeManual || !filtros.tipo_unidade) return true;
            return u.tipo_unidade === filtros.tipo_unidade;
        })
        .sort((a, b) => a.unidade_educacional.localeCompare(b.unidade_educacional, 'pt-BR'))
        .map((u) => ({
            ...u,
            id: u.uuid,
        }));

    const periodosFormatados = (tabelaPaa.periodos || [])
        .sort((a, b) => {
            const [anoA, semestreA] = a.referencia.split('.').map(Number);
            const [anoB, semestreB] = b.referencia.split('.').map(Number);

            if (anoA !== anoB) return anoB - anoA;

            return semestreB - semestreA;
        })
        .map((p) => ({
            ...p,
            nome: p.referencia,
            id: p.uuid,
        }));

    const tiposUnidadeOrdenados = (tabelaPaa.tipos_unidade || []).sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR'),
    );

    const statusOrdenados = (tabelaPaa.status || []).sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR'),
    );

    return (
        <form data-testid='filtros-form' onSubmit={aoSubmeterFiltros}>
            <div className='row'>
                <SelectMultiFiltro
                    label='Filtrar Vigência do PAA'
                    name='periodo'
                    value={filtros.periodo}
                    data={periodosFormatados}
                    onChange={aoAlterarFiltro}
                    className='col-12 col-sm-6 col-md-4 mb-3'
                />

                <SelectFiltro
                    showSearch
                    label='Filtrar por unidade'
                    name='unidade'
                    value={filtros.unidade}
                    onChange={aoAlterarFiltro}
                    placeholder='Escreva o nome da unidade'
                    data={unidadesFiltradas}
                    optionLabel='unidade_educacional'
                    className='col-12 col-sm-6 col-md-4 mb-3'
                />

                <SelectFiltro
                    showSearch
                    label='Filtrar por tipo de unidade'
                    name='tipo_unidade'
                    value={filtros.tipo_unidade}
                    onChange={aoAlterarFiltro}
                    data={tiposUnidadeOrdenados}
                    disabled={!!filtros.unidade}
                    className={`col-12 col-sm-6 col-md-4 mb-3 ${
                        filtros.unidade ? 'disabled-field' : ''
                    }`}
                />

                <SelectMultiFiltro
                    label='Filtrar por status'
                    name='status'
                    value={filtros.status}
                    data={statusOrdenados}
                    placeholder='Selecione os status'
                    onChange={aoAlterarFiltro}
                    className='col-12 col-sm-6 col-md-4 mb-3'
                    containerStyle={{}}
                />
            </div>

            <div className='d-flex flex-column justify-content-end pb-3 flex-sm-row'>
                <button
                    onClick={limpaFiltros}
                    type='button'
                    className='btn btn-outline-success mt-2 mr-sm-2'
                >
                    Limpar
                </button>

                <button type='submit' className='btn btn-success mt-2'>
                    Filtrar
                </button>
            </div>
        </form>
    );
};
