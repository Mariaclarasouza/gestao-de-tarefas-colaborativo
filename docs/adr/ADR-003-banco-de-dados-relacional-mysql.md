ADR 003 - Banco de Dados Relacional
Status: Aceito
Contexto:
 Para o armazenamento de dados estruturados como usuários, tarefas e permissões, foi necessário um banco relacional confiável e amplamente suportado.
Decisão:
 Adotou-se o MySQL, acessado via pacote mysql2 no Node.js.
Consequências:
Garantia de integridade e relacionamentos entre dados.


Uso de queries SQL para manipulação dos dados.


Dependência da instalação e configuração do MySQL no ambiente.
