ADR 016 - Agendamento de Tarefas com node-cron
Status: Aceito
Contexto:
 Algumas funcionalidades do sistema requerem execução periódica de tarefas, como limpeza ou notificações.
Decisão:
 Implementar agendamento de tarefas usando node-cron.
Consequências:
Tarefas automatizadas facilitam manutenção e funcionalidades avançadas.


Pode aumentar a complexidade do backend.


Necessidade de monitorar falhas em tarefas agendadas.
