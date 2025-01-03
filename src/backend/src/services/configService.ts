import dotenv from 'dotenv';
dotenv.config();

function getRequiredValue<T>(key: string): T {
  const value: unknown | undefined = process.env[key];
  if (!value) {
    throw new Error(`Config value for: ${key} not set`);
  }
  return value as T;
}

function getValue(key: string, defaultValue: string) {
  const value = process.env[key];
  if (value) {
    return value;
  }

  return defaultValue;
}

export { getRequiredValue, getValue };
