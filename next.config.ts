import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Import version from package.json
import packageJson from './package.json';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Expose version to client-side code
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default withNextIntl(nextConfig);
