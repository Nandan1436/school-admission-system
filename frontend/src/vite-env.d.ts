interface AppRuntimeConfig {
  apiBaseUrl?: string;
}

interface Window {
  __APP_CONFIG__?: AppRuntimeConfig;
}
