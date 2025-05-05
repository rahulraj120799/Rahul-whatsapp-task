/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'platform-lookaside.fbsbx.com',
    ],
  },
};

export default nextConfig;
