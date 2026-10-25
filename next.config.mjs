/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML/JS build in ./out so it can be uploaded to shared hosting (HostGator) without Node.
  output: 'export',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
