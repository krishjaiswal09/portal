// Utility functions for case transformation between frontend and backend

export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const transformObjectToSnakeCase = <T extends Record<string, any>>(
  obj: T
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[snakeKey] = transformObjectToSnakeCase(value);
    } else {
      result[snakeKey] = value;
    }
  }

  return result;
};

export const transformObjectToCamelCase = <T extends Record<string, any>>(
  obj: T
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[camelKey] = transformObjectToCamelCase(value);
    } else {
      result[camelKey] = value;
    }
  }

  return result;
};

export const getUTCJoinTime = (): string => {
  const now = new Date();
  const utcHours = now.getUTCHours().toString().padStart(2, "0");
  const utcMinutes = now.getUTCMinutes().toString().padStart(2, "0");
  const utcSeconds = now.getUTCSeconds().toString().padStart(2, "0");
  return `${utcHours}:${utcMinutes}:${utcSeconds}`;
};
