
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexus.play',
  appName: 'Nexus Play',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Configuration for plugins if needed later
  }
};

export default config;
