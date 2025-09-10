# Rotas da API

## Rotas de gerenciamento de usuários

### GET("/users")

- Lista todos os usuários;

### GET("/user/:id")

- Retorna os dados de um usuário;
- Requer o ID passado na URI;

### POST("/user")

- Cadastra um novo usuário;
- Precisa dos campos de email, name, password e age;

### DELETE("/user/:id")

- Deleta um usuário;
- Requer o ID do usuário passado na URI;

### PUT("/user/:id")

- Necessita de autenticação (Login/Refresh);
- Edita um usuário;
- Requer o id do usuário na URI, um email e uma senha válidos e os dados a serem editados, eles podem ser:  name, age, level e/ou job;
- Retorna o usuário encontrado;

### POST("/user/comment")

- Necessita de autenticação (Login/Refresh);
- Anexa um comentário a um usuário;

## Rotas de Autenticação

### POST("/login")

- Realiza a autenticação do usuário;

- Necessita de email e senha passado no **corpo** da requisição;
- Retorna o token de acesso e o refresh token no cookie ou no secureStorage (mobile);

### PUT("/refresh")

- Atualiza o AcessToken (Token de curto prazo);

- Requer o refresh token passado no cookie ou secureStorage;
- Responde com um novo token no cookie (ou secureStorage) e o refreshToken atualizado;

### DELETE("/logout")

- Necessita de autenticação (Login/Refresh);
- Encerra todas as sessões do usuário;
