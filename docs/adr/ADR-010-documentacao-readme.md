ADR 010 – Estratégia de Documentação no Repositório
Status: Aceita


Contexto
A documentação é essencial para o entendimento, uso e evolução do projeto por novos contribuidores, usuários e desenvolvedores. Com a crescente complexidade do TaskFlow, tornou-se necessário padronizar onde e como a documentação é mantida.
Problema
Como garantir que o projeto tenha uma fonte única e acessível de informações técnicas, de configuração e uso?
Decisão
Adotar o README.md como ponto central de documentação no repositório GitHub. Esse arquivo conterá:
Visão geral do projeto


Tecnologias utilizadas


Instruções de instalação e uso


Estrutura de pastas


Requisitos e variáveis de ambiente


Considerações importantes e licenciamento


Outras documentações futuras (como APIs, rotas, testes, ADRs) poderão ser adicionadas em subpastas específicas (/docs, /adr, etc.).

Justificativas Técnicas
O README.md é automaticamente exibido na interface do GitHub, tornando-o acessível e visível.


Reduz a necessidade de múltiplos documentos fragmentados.


Facilita o onboarding de novos colaboradores.
Consequências
Positivas:
Melhora a compreensão do projeto por novos membros.


Reduz erros por desconhecimento de configuração ou ambiente.


Base sólida para futura documentação expandida.


Negativas:
Requer manutenção constante para não ficar desatualizado.


Pode crescer demais e perder clareza se não for bem estruturado.


