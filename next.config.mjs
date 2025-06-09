/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
    domains: ['ezhealthluixz.netlify.app'],
    // Aqui nós autorizamos os domínios para as imagens.
    // 'remotePatterns' é a forma moderna e recomendada de autorizar domínios.
    remotePatterns: [
      {
        protocol: 'https',
        // ✅ MUDANÇA PRINCIPAL: O coringa '**' autoriza QUALQUER hostname.
        hostname: '**',
      },
      {
        // Também é uma boa prática autorizar 'http' se necessário.
        protocol: 'http',
        hostname: '**',
      }
      // {
      //   protocol: 'https',
      //   hostname: 'placehold.co',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'avatars.githubusercontent.com',
      // },
      // ✅ IMPORTANTE: Se no futuro você usar outro serviço de upload (como Cloudinary, S3, etc.),
      // você precisará adicionar o hostname dele aqui também.
    ],
  },
};

export default nextConfig;