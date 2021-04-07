# SME.PTRF.Frontend.RPA

Robot para automação dos testes de performance e validação de funcionalidades.


## Preparação do ambiente

Para preparar o ambiente, pode seguir as instruções de instalação [aqui](https://github.com/robotframework/robotframework/blob/master/INSTALL.rst). 


## Organização do repositório

O arquivo `rpa/src/configuracao/variaveis.robot` possui as variáveis globais necessárias para a execução dos testes no ambiente local de desenvolvimento, caso precisa rodar em outro ambiente deve passar as variaveis por linha de comando como descrito neste [link](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#variable-files).


## Executando os testes

Para executar um teste específico basta rodar o comando `robot` apontando para a pasta root dos testes:

```
robot rpa/
```
