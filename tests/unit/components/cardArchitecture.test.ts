import fs from 'node:fs';
import path from 'node:path';

const cardDirectories = [
  path.resolve(__dirname, '../../../shared/components/ui/content'),
  path.resolve(__dirname, '../../../shared/components/ui/charts'),
];

const forbiddenDependencies = [
  /from\s+['"][^'"]*(?:navigation|expo-router)[^'"]*['"]/, 
  /from\s+['"][^'"]*(?:services|api|http|queries)[^'"]*['"]/, 
  /\b(?:useNavigation|useRoute|httpClient|axios|fetch)\b/,
];

describe('domain card architecture', () => {
  it('keeps cards independent from navigation and HTTP transport', () => {
    const violations = cardDirectories.flatMap((directory) =>
      fs
        .readdirSync(directory)
        .filter((fileName) => fileName.endsWith('Card.tsx'))
        .flatMap((fileName) => {
          const source = fs.readFileSync(path.join(directory, fileName), 'utf8');
          return forbiddenDependencies
            .filter((pattern) => pattern.test(source))
            .map((pattern) => `${fileName}: ${pattern.source}`);
        }),
    );

    expect(violations).toEqual([]);
  });
});
