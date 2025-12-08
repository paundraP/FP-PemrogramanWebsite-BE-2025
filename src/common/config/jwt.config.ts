export const JwtConfig = {
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET ||
    'VQvJF4b7xtJyyqvZ7bLrgpnYKGXlgCuSiTQnzgQXEWhtftLaHE8NAYoNuQPK62Tv',
  JWT_ACCESS_EXPIRES_IN:
    Number.parseInt(process.env.JWT_ACCESS_EXPIRES_IN!) || 6 * 60 * 60, // 6h
};
