ADR 008 - Gerenciamento de Estado no Frontend
Status: Aceito
Contexto:
 Gerenciar o estado da aplicação pode ser complexo, principalmente para dados compartilhados entre vários componentes.
Decisão:
 Optou-se por não utilizar bibliotecas externas de gerenciamento de estado (como Redux). O estado é gerenciado internamente usando os hooks nativos do React.
Consequências:
Menos dependências externas e simplicidade no código.


Pode limitar a escalabilidade do gerenciamento de estado para funcionalidades futuras.


Desenvolvimento mais ágil para estados simples.


