# SME-PTRF-FrontEnd

========

Front da aplicação _SIG.Escola_ da Secretaria de Educação da cidade de São Paulo.

License: MIT

Versão: 0.4.0

## Release Notes

### 0.4.0 - 16/06/2020 - Entregas da Sprint 5

- Sprint em andamento...

### 0.3.0 - 28/05/2020 - Entregas da Sprint 4

- Exibição de referência e status do período no painel de ações
- Alteração automática do status do período na associação
- Exibição de outras receitas no painel de ações
- Navegação entre períodos no painel de ações
- Alerta no lançamento de despesas acima do saldo por ação
- Exibição de totais de despesas em Gastos da Escola
- Categorização de receitas em Custeio e Capital
- Destacar campos incompletos no cadastro de despesa
- Inicio do processo de prestação de contas
- Conciliação de lançamentos na prestação de contas
- Bloqueio de alterações em receitas de períodos fechados
- Bloqueio de alterações em despesas de períodos fechados
- Geração de demonstrativo financeiro

### 0.2.0 - 28/04/2020 - Entregas da Sprint 3

- Confirmação de repasses pela Associação
- Alerta na despesa sobre o uso de especificações do Sistema de Bens Patrimoniais Móveis do PMSP
- Filtros diversos para consulta de despesas
- Filtros diversos para consulta de receitas
- Cadastro de Associações
- Registro de fornecedores usados
- Painel de Ações da Associação

### 0.1.0 - 07/04/2020 - Entregas da Sprint 2

- Autenticação de usuário
- Cadastro de despesas
- Cadastro de receitas

### Para desenvolver

I) Clone o repositório.

```console
$ git clone https://github.com/prefeiturasp/SME-PTRF-FrontEnd.git front
$ cd front
```

II. Instale as dependências.

```console
$ npm i
```

III. Configure a instância com o .env

```console
$ cp env_sample .env
```

IV. Execute os testes.

```console
$ npm test
```

V. Execute a aplicação.

```console
$ npm start
```
