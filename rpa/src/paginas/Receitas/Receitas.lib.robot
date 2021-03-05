*** Settings ***
Documentation       Lib de comandos para a tela de receitas

Library             SeleniumLibrary
Library             OperatingSystem

Resource            ../../configuracao/variaveis.robot

*** Variables ***
${SCHOOL CREDIT MENU ITEM}              div[data-for="creditos_da_escola"]
${SCHOOL CREDIT PAGE HEADER}            h1.titulo-itens-painel

${SCHOOL DEBITS MENU ITEM}              div[data-for="gastos_da_escola"]
${NEW DEBIT BUTTON}                     span.float-right>button.float-right
${SAVE DEBIT BUTTON}                    div.justify-content-end>button[type=button].btn-success

${NEW CREDIT BUTTON}                    div.page-content-inner button[type=submit].btn-outline-success
${SUCCESS MODAL}                        div[role=document].modal-dialog.modal-dialog-centered
${SUCCESS MODAL CLOSE BUTTON}           ${SUCCESS MODAL}>div.modal-content>div.modal-footer>button.btn-primary

${FORM INPUT SLEEP TIME}                1s

${RANDOM DOC ID}=                        Evaluate    random.randint(0, sys.maxsize)    random
${RANDOM DOC TRANSACTION ID}=            Evaluate    random.randint(0, sys.maxsize)    random

*** Keywords ***
Navigate To School Credits
    Click Element                       css=${SCHOOL CREDIT MENU ITEM}
    Wait Until Element Is Visible       css=${NEW CREDIT BUTTON}

Navigate To New School Credit
    Navigate To School Credits
    Click Element                       css=${NEW CREDIT BUTTON}
    Wait Until Element Is Visible       css=form#receitaForm

Fill New School Credit Form And Save
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=tipo_receita
    Select From List By Label           id=tipo_receita             Rendimento          # Tipo do Credito
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=detalhe_tipo_receita
    Select From List By Value           id=detalhe_tipo_receita     6                   # Rendimento A
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       name=data
    Input Text                          name=data                     05/03/2021          # Data do Credito
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=conta_associacao
    Select From List By Label           id=conta_associacao         Cheque              # Tipo de Conta
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=acao_associacao
    Select From List By Label           id=acao_associacao          PTRF Básico         # Ação
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=categoria_receita
    Select From List By Value           id=categoria_receita        LIVRE               # Classificacao de Credito
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=valor
    Input Text                          id=valor                    R$ 1,00             # Valor
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       css=button[type=submit].btn-success             # Botao Salvar
    # TODO Melhorar seletor do modal de sucesso
    Wait Until Element Is Visible       css=${SUCCESS MODAL}
    Click Element                       css=${SUCCESS MODAL CLOSE BUTTON}

Navigate To School Debits
    Click Element                       css=${SCHOOL DEBITS MENU ITEM}
    Wait Until Element Is Visible       css=div.lista-de-despesas-visible

Navigate To New School Debit
    Navigate To School Debits
    Click Element                       css=${NEW DEBIT BUTTON}
    Wait Until Element Is Visible       css=h1.titulo-itens-painel

Fill New School Debit Form And Save
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=cpf_cnpj_fornecedor
    Input Text                          id=cpf_cnpj_fornecedor          ${MOCK SUPPLIER ID}

    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=nome_fornecedor
    Input Text                          id=nome_fornecedor              Alessandro
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=tipo_documento
    Select From List By Label           id=tipo_documento               Recibo
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       name=data_documento
    Input Text                          name=data_documento             05/03/2021
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=numero_documento
    Input Text                          id=numero_documento             ${RANDOM DOC ID}

    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=tipo_transacao
    Select From List By Label           id=tipo_transacao               Cheque

    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       name=data_transacao
    Input Text                          name=data_transacao             05/03/2021

    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=documento_transacao
    Input Text                          id=documento_transacao          ${RANDOM DOC TRANSACTION ID}

    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       name=valor_original
    Input Text                          name=valor_original               R$ 1,00
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=tipo_custeio
    Select From List By Label           id=tipo_custeio                 serviço
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=especificacao_material_servico
    Select From List By Label           id=especificacao_material_servico        Arbitragem

    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=acao_associacao
    Select From List By Label           id=acao_associacao          PTRF Básico

    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       id=conta_associacao
    Select From List By Label           id=conta_associacao         Cheque

    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       name=rateios[0].valor_original
    Input Text                          name=rateios[0].valor_original               R$ 1,00
    
    Sleep                               ${FORM INPUT SLEEP TIME}
    Click Element                       css=${SAVE DEBIT BUTTON}
    Wait Until Element Is Visible       css=h1.titulo-itens-painel
