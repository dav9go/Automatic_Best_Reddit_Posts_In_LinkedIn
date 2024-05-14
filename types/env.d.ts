interface ProcessEnv {
  LINKEDIN_ACCESS_TOKEN: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {}
  }
}
