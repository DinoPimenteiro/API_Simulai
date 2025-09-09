# Rotas da API

## Rotas de gerenciamento de usuários

### GET("/users")

### POST("/user")

### DELETE("/user/:id")

### PUT("/user/:id")

### POST("/user/comment")

## Rotas de autenticação

### POST("/login")

Rota para realização da autenticação do usuário

- Necessita de email e senha passado no **corpo** da requisição;
- Retorna o token de acesso e o refresh token passado no cookie;

### POST("/refresh")

Rota com o objetivo de atualizar o refreshToken;

- Requer o refresh token passado no cookie;
- Responde com um novo token no cookie e o refreshToken atualizado;

### DELETE("/logout")
