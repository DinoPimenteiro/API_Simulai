export default function getRefreshToken(req) {
  return (
    req.cookies?.refreshToken ||  // web (com cookie parser);
    req.body?.refreshToken ||     // mobile (salvo no secureStorage);
    req.headers["x-refresh-token"] // header customizado
  );
}
