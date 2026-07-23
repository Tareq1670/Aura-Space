import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "i.ibb.co",
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/uploads/:path*",
                destination: "http://localhost:5000/uploads/:path*",
            },
        ];
    },
};

export default nextConfig;
