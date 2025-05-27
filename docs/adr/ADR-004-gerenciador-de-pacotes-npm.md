ADR 004 - Gerenciamento de Pacotes com npm
Status: Aceito
Contexto:
 O projeto necessitava de uma ferramenta para gerenciar as dependências tanto no frontend quanto no backend, garantindo controle de versões e facilidades na instalação.
Decisão:
 Foi utilizado o npm como gerenciador de pacotes em ambos os ambientes.
Consequências:
Controle centralizado das dependências e versões.


Facilidade para instalar, atualizar e remover pacotes.


Possíveis conflitos de dependência gerenciáveis com package-lock.json.
