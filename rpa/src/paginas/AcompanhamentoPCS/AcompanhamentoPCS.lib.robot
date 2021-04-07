*** Settings ***
Documentation       Lib de comandos para a tela de Acompanhamento de Contas

Library             SeleniumLibrary
Library             OperatingSystem

Resource            ../../configuracao/variaveis.robot

*** Variables ***
${SCHOOL SELECTOR}                      div.container-select-visoes>div>div.w-100>select
${SCHOOL SELECTOR LABEL}                EMEBS - NEUSA BASSETTO, PROFA.

*** Keywords ***
Select School
    Wait Until Element Is Visible       css=${SCHOOL SELECTOR}
    Select From List By Label           css=${SCHOOL SELECTOR}  ${SCHOOL SELECTOR LABEL}
