# Lista tarefas

- Ajeitar o retorno dos erros e dos resultados (retorno dos tokens) e organizar melhor o fluxo;
- Começar o repo de admin;
- Implementar um middleware só para administradores;
- Achar uma forma segura para criar administradores;
- Colocar sob controle do admin todos os recursos descritos na documentação.

## Lembretes

- Manter sempre a documentação atualizada e organizada para que o frontend, tanto o do mobile quanto o web, consiga realizar as requisições necessárias. Fornecer se o endpoint (rota) tem algum middleware, o que a rota retorna, o que ela necessita, quais erros ela pode retornar e outras coisas que podem ser consideradas como importante.

## Problemas

- O usuário pode criar quantos tokens válidos quiser;
- A biblioteca utilizada para enviar emails, nodeMailer, não é escalável. A alternativa seria usar o SendGrid;
- Mudança na estrutura do projeto quando anexado a um domínio (na questão do envio de email principalmente.);
- Não é compatível com IOS;
- Não utiliza o OAUTH2 no consumo de APIs;
