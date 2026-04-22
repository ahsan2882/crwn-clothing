export const getRequiredEnv = (value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required env var`);
  }
  return value;
};
