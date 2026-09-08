export const formatMessage = (
  template: string,
  values: Readonly<Record<string, string | number>>,
): string => template.replace(/\{([a-zA-Z0-9]+)\}/g, (match, key: string) => {
  const value = values[key];
  return value === undefined ? match : String(value);
});

export const readSerializedMessages = <T>(root: HTMLElement): T => {
  const serialized = root.dataset.messages;
  if (!serialized) throw new Error('Localized tool messages are missing');
  return JSON.parse(serialized) as T;
};
