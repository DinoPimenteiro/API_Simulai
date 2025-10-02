# Lista tarefas

- Criar a criptografia do secret por parte do cadastro e login de administrador;
- Testar tudo e validar a ordem dos procedimentos (por exemplo, dá erro e mesmo assim executa algum comando no banco de dados);

- Implementar as seguintes funcionalidades para **Administradores**:
  - Verificação com TOTP (authenticator) no login de administrador;
  - Listagem, edição e deleção de comentários dos clientes;
  - Listagem das métricas dos usuários, idade, nível e avaliações;

- Implementar as seguintes funcionalidades para **Clientes**
  - Possibilidade de envio de arquivos para o sistema (imagem do usuário e currículo);
  - Sistema de pesquisa com alternativas para traçar o nível do usuário;
  - Edição e exclusão de comentário;
  - Pesquisa referente ao seu nível;

## Lembretes

- Manter sempre a documentação atualizada e organizada para que o frontend, tanto o do mobile quanto o web, consiga realizar as requisições necessárias. Fornecer se o endpoint (rota) tem algum middleware, o que a rota retorna, o que ela necessita, quais erros ela pode retornar e outras coisas que podem ser consideradas importantes.
- **Refatorar o código inteiro antes de receber as funções de inteligência artificial;**

## Problemas

- O usuário pode criar quantos tokens válidos  quiser;
- A biblioteca utilizada para enviar emails, nodeMailer, não é escalável. A alternativa seria usar o SendGrid;
- Mudança na estrutura do projeto quando anexado a um domínio (na questão do envio de email principalmente.);
- Não é compatível com IOS;
- Não utiliza o OAUTH2 no consumo de APIs;
