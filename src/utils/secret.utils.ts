export const getRequiredEnv = (
  key: string,
  value: string | undefined,
): string => {
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};
