/* eslint-disable @typescript-eslint/naming-convention */

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_GEN_AI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}
