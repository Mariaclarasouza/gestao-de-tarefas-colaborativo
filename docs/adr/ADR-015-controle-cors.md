ADR 015 - Controle de CORS
Status: Aceito
Contexto:
 Para permitir requisições do frontend hospedado em origem diferente do backend, é necessário configurar CORS.
Decisão:
 Utilizar o pacote cors no backend para habilitar políticas de acesso entre origens.
Consequências:
Permite comunicação segura entre frontend e backend.


Necessidade de configurar corretamente os domínios permitidos para evitar vulnerabilidades.
