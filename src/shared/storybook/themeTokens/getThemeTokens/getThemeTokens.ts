interface IThemeToken {
  name: string;
  value: string;
}

const themeBlockExpression = /@theme\s*\{([\s\S]*?)\}/m;
const tokenExpression = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;

export const getThemeTokens = (
  cssSource: string,
  tokenPrefix: string,
): IThemeToken[] => {
  const themeBlock = cssSource.match(themeBlockExpression)?.[1] ?? '';
  const tokens: IThemeToken[] = [];
  let tokenMatch: RegExpExecArray | null;

  while ((tokenMatch = tokenExpression.exec(themeBlock))) {
    const [, name, rawValue] = tokenMatch;

    if (name.startsWith(tokenPrefix)) {
      tokens.push({
        name,
        value: rawValue.trim(),
      });
    }
  }

  return tokens;
};
