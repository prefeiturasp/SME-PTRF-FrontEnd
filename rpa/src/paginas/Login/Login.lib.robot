*** Settings ***
Documentation       Lib de comandos para o fluxo de login

Library             SeleniumLibrary
Library             OperatingSystem

Resource            ../../configuracao/variaveis.robot

*** Variables ***
${LOGIN URL}                            http://${SERVER}/login

${LOGIN BUTTON SELECTOR}                form>button[type=submit].btn.btn-success
${EXIT BUTTON SELECTOR}                 a#linkDropdownAcoes>button.btn-sair

*** Keywords ***
Open Browser To Login Page
    Open Browser                        ${LOGIN URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed                  ${DELAY}

Login Into System
    Input Username                      ${VALID USER}
    Input Password                      ${VALID PASSWORD}
    Submit Credentials
    Wait Until Page Contains Element    css=${EXIT BUTTON SELECTOR}

Input Username
    [Arguments]                         ${username}
    Click Element                       id=login
    Input Text                          id=login    ${username}

Input Password
    [Arguments]                         ${password}
    Click Element                       id=senha
    Input Text                          id=senha    ${password}

Submit Credentials
    Click Button                        css=${LOGIN BUTTON SELECTOR}
