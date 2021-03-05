*** Settings ***
Documentation       Robo de teste para validar a seguinte jornada do usuário:
...                 1. Inputar Usuario e Senha
...                 2. Enviar as credenciais clicando no botao Acessar
...                 3. Aguardar aparecer dropdown de ações

Resource            Login.lib.robot
Resource            ../AcompanhamentoPCS/AcompanhamentoPCS.lib.robot
Resource            ../Receitas/Receitas.lib.robot

*** Keywords ***
Teardown
    Close Browser

*** Test Cases ***
User Jorney
    Open Browser To Login Page
    Login Into System
    
    Select School
    
    # Navigate To New School Credit
    # Fill New School Credit Form And Save

    Navigate To New School Debit
    Fill New School Debit Form And Save

    Sleep                                   2s
    [Teardown]  Teardown
