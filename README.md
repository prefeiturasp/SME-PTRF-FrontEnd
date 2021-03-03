# SME-PTRF-FrontEnd

Front da aplicação _SIG.Escola_ da Secretaria de Educação da cidade de São Paulo.

License: MIT

Versão: 1.7.0

## Release Notes

### 1.7.0 - 05/03/2021 - Entregas da Sprint 16
* Em andamento...

### 1.6.0 - 16/02/2021 - Entregas da Sprint 15
* Informações do usuário agora no topo da tela
* UE > Campos para telefone e endereço no cadastro do presidente da associação
* SME > Cadastro de Tipos de Custeio
* SME > Cadastro de Etiquetas (Tags)
* SME > Edição dos textos "Fique de olho"
* SME > Carga de associações
* Ajustes em textos diversos
* 🐞 Correção de bugs

### 1.5.0 - 02/02/2021 - Entregas da Sprint 14
* DRE > Melhorias no relatório consolidado
* DRE > Motivos de aprovação com ressalvas no acompanhamento de PCs
* DRE > Seleção de período do acompanhamento de PCs agora inicia com o período anterior e não o corrente
* DRE > Novo bloco "Associações não regularizadas" no relatório consolidado DRE
* SME > Cadastro de Associações
* SME > Cadastro de Ações
* SME > Cadastro de vínculos de ações e associações
* SME > Cadastro de Períodos
* Nova imagem na tela de login do sistema
* UE > Melhorias na geração de prestações de contas
* UE > Cadastro de membros agora vincula automaticamente o membro ao seu usuário do sistema 

### 1.4.0 - 07/01/2021 - Entregas da Sprint 13
* Visão SME
* SME > Painel de parâmetros do sistema
* SME > Acompanhamento de prestações de conta > Resumo Geral
* SME > Acompanhamento de prestações de conta > Resumo por DRE (lista)
* Lançamento de Créditos não relativos ao PTRF
* Melhorias na Ata de Retificação
* Seleção de repasses ao cadastrar créditos
* Recurso de exclusão de membros da associação
* Melhorias no acompanhamento de prestações de contas da DRE
* 🐞 Correção de alguns poucos bugs ;-)

### 1.3.0 - 08/12/2020 - Entregas da Sprint 12
* Carga de previsões de repasse da SME;
* Carga de quantidade de alunos do último celso;
* Vínculo de membros da associação a seus usuários no sistema;
* Uso do CPF para identificar membros de associação que são pais ou responsáveis;
* Configurado monitoramento de erros (Sentry);
* Dashboard da DRE movido para o ítem de menu 'Acompanhamento';
* Melhoria no texto da mensagem de alerta sobre períodos bloqueados para alteração;
* Melhorias na navegação entre informações na consulta de Associações pela DRE;
* Uso de perfis de acesso nas ações da consulta de Associações pela DRE;
* Aplicação de máscara na digitação do processo SEI de regularidade da Associação;
* Mensagem de confirmação de gravação ao atualizar dados da DRE;
* Geração de documentos de prestação de contas de forma assíncrona;
* Relatório Consolidado DRE (Parte 2);
* Mudança no critério de 'Prestações de Contas Não Recebidas' no painel da DRE;
* No painel da DRE, o total de associações passa a desconsiderar associações sem CNPJ;
* Geração de notificações para o presidente e vice-presidente da associação, sobre comentários feitos pela DRE na análise de uma prestação de contas;  
* Bloqueio de conciliação de lançamentos em períodos fechados;
* Restrições de edição para a associação em devoluções ao tesouro registradas pela DRE;
* Na inclusão/edição de despesas, mensagem de confirmação ao sair, apenas quando houver mudanças;
* Expiração de acesso do usuário após 10 horas de logado;  
* Ajustes menores em textos e labels;
* 🐞 Correção de alguns bugs.

### 1.2.1 - 19/11/2020 - Hotfix
* 🐞28206 - Erro de autenticação ao baixar relações de bens de prestações de contas

### 1.2.0 - 10/11/2020 - Entregas da Sprint 11
* Gestão de perfis de acesso às funcionalidades do sistema
* Cadastro de Devoluções ao Tesouro na análise de prestações de conta pela DRE
* Inclusão de comentários na análise de prestações de conta pela DRE
* Atas de retificação
* Relatório Consolidado DRE (Parte 1)
* Permitir a parametrização de um tipo de conta para apenas leitura
* Saldos negativos agora são exibidos em vermelho no painel financeiro da Associação
* Recuperação de senha ("esqueci minha senha") agora usa o e-mail cadastrado no CoreSSO
* Inclusão de campos para telefone e e-mail no cadastro de técnicos da DRE
* Mudanças nos filtros do cadastro de créditos da Associação
* Mudança na forma de exibição da visão do usuário, agora ao lado do seletor de unidade
* 🐞 Correção de alguns bugs.

### 1.1.0 - 09/10/2020 - Entregas da Sprint 10
* Parametrização de tipos de crédito por conta
* Ata consolidada por prestação de contas (todos as contas)
* Excluida opção de aprovação com ressalva de uma ata
* Uso de campos default na criação de uma conta
* Mensagem de tempo de transação não demonstrada na conciliação agora é em meses
* Validação de cadastros repetidos de membros da Associação
* O cadastro de crédito agora só confirma a saida da edição se tiver ocorrido alguma alteração
* Relação de bens agora só é gerada quando há aquisição de bens no período
* Dashboard da DRE para acompanhamento de prestações de contas
* Lista de prestações de contas por status
* Workflow de acompanhamento de prestações de contas pela DRE
* 🐞 Correção de alguns bugs.

### 1.0.0 - 15/09/2020 - Entregas da Sprint 9
* Entrada em produção (Piloto com algumas Associações)
* Desacoplamento dos processos de conciliação e prestação de contas;
* Transações já conciliadas, quando modificadas, voltam ao estado de não conciliadas;
* Alteração do processo de prestação de contas para incluir todas as contas da Associação em vez de ser uma prestação por conta;
* Prévias parciais para os relatórios de demonstrativo financeiro e relação de bens da prestação de contas;
* Melhorias no painel financeiro das associações;
* Na visão DRE, consulta da situação financeira de uma associação;
* Central de Notificações;
* Apoio à Diretoria: FAQ;
* Demonstrativos financeiros e relações de bens agora incluem a data de geração do documento;
* Na visão DRE, consulta de dados das Unidades Educacionais trazendo informações do EOL;
* Atribuições de Técnicos da DRE à Unidades Educacionais;
* Possibilidade de copiar atribuições de técnicos de um outro período;
* Transferência de atribuições de um técnico para outro no momento de uma exclusão de técnico;
* Aprimoramentos no relatório de demonstrativo financeiro;
* Melhoria nos icones dos menus;
* Melhoria na posição das tags no formulário de despesa;
* 🐞 Correção de alguns erros.

### 0.7.0 - 20/08/2020 - Entregas da Sprint 8
* Exportação de dados da Associação;
* Gestão de valor realizado nas despesas da Associação;
* Notificação de transações não demonstradas a mais de certo tempo;
* Prestação de contas: Permitir selecionar apenas períodos até o próximo período pendente;
* Menus sensíveis às visões UE e DRE;
* Permite ao usuário alternar entre visões e unidades (UEs ou DREs);
* Lista de associações da DRE;
* Consulta dados de uma associação da DRE;
* Consulta dados de uma UE da DRE;
* Cadastro de processos SEI de regularidade e prestação de contas de uma Associação;
* Checklists de regularidade de uma associação da DRE;
* Consulta de dados da DRE;
* Cadastro de técnicos da DRE.

### 0.6.0 - 28/07/2020 - Entregas da Sprint 7
* Melhoria nas mensagens de consistência de valores no lançamento de despesas;
* Novos campos (e-mail e CCM) no cadastro da Associação;
* Processo de recuperação de senha ("Esqueci minha senha");
* Perfil do usuário com possibilidade de troca de e-mail e senha;
* Permitir parametrizar tipos de documento de despesas para pedirem ou não o número do documento;
* Melhorias visuais no menu do sistema;
* Edição via Admin do texto exibido no "Fique de Olho" em prestações de contas;
* Em prestações de contas exibir demonstrativos financeiros apenas par ações com saldo ou movimentação;
* Na Ata exibir apenas ações que tenham saldos ou movimentação no período;
* Em despesas trazer o automaticamente o valor do rateio quando não houver multiplos rateios;
* No painel de ações exibir apenas ações que tenham saldo ou movimentação no período;
* Ajustes na formatação de valores do demonstrativo financeiro;
* Desconsiderar acentuações no filtro de despesas;
* Desconsiderar acentuações no filtro de receitas;
* Ajustes no layout da ata;
* Ajuste no brasão PMSP;
* Pedir período de referência em créditos do tipo devolução;
* Apresentar na Ata os créditos de devolução;
* Permitir criar tags e associa-las a uma despesa.  
* 🐞 Correção de erros diversos.


### 0.5.0 - 07/07/2020 - Entregas da Sprint 6
- Confirmação de repasses na entrada de créditos agora considera a classificação da receita em capital ou custeio;
- Lançamento de saldos reprogramados (implantação de saldos);
- Cadastramento de todos os cargos da Associação;
- Cadastramento de dados das contas da Associação;
- Verificação de duplicidade no lançamento de uma despesa;
- CNPJ/CPF do fornecedor agora é brigatório no lançamento de uma despesa;
- Períodos futuros não são mais exibidos no painel de ações;
- Implementadas buscas por data e fornecedor na consulta de despesas;
- Implementada busca por data na consulta de créditos;
- Parametrização por tipo de documento para aceitar apenas dígitos no lançamento de despesas;
- Exibição de "Carregando" nos módulos de despesas, prestações de contas e dados da associação;
- Implementado botão para limpar filtros na consulta de créditos;
- Implementado botão para limpar filtros na consulta de despesas;
- O número do processo de incorporação recebeu uma máscara 0000.0000/0000000-0;
- Criado campo para detalhamento de créditos parametrizavel por tipo de crédito;
- O campo de observação da prestação de contas agora é vinculado à ação da associação;
- Exibição de valores de créditos futuros na ata da prestação de contas;
- Exibição do nome da escola abaixo do usuário em vez do nome da associação; 
- Várias melhorias visuais no front (Ex: cor do logo, icones do menu, etc.);

### 0.4.0 - 16/06/2020 - Entregas da Sprint 5

- Geração do documento Relação de Bens na prestação de contas
- Adicionado campo "Nº do cheque" no lançamento de despesas
- Geração da Ata na prestação de contas
- Adicionada a verificação de suficiência de saldo por conta no lançamento de despesas
- Exibição de tabela de valores pendentes no processo de conciliação
- Melhoria na mensagem de validação de consistência de valores no lançamento de despesas
- Seleção de período na prestação de contas não exibe mais períodos futuros
- Lista de especificações de materiais serviços agora é exibida em ordem alfabética
- Agora é possível determinar a ordem que as ações serão exibidas no painel de ações e em outras partes da aplicação
- Adicionado feedback visual (loading) para processos demorados no módulo de receitas
- Agora a conciliação exibe transações não conciliadas mesmo de períodos anteriores
- 🐞 Correção de erros


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
