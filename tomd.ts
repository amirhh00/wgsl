/**
 * A simple tool to create a markdown file with the content of all files in a directory.
 * By default, it will look for files with extensions .ts, .tsx, .js, .jsx, .mjs, .cjs in the current directory.
 *
 * Options:
 * -i, --input: Input directory path (default: './')
 * -e, --ext: Regular expression for file extensions (default: '\\.(ts|tsx|js|jsx|mjs|cjs)$')
 * -o, --output: Output markdown file path (default: 'output.md')
 * -g, --ignoreGitignore: Ignore .gitignore file (default: true)
 *
 * Example: node --experimental-strip-types tomd.ts -i ./src -e '\\.(ts|tsx|js|jsx)$' -o output.md -g false
 *
 * Note: This script uses experimental-strip-types flag to remove types from the TypeScript code. So, it will only work with Node.js 23.0.0 or later.
 * Note 2: This script only works on windows, if you want to run it on other OS, you need to change the path separator in the getIgnoredPaths function.
 * Note 3: You can convert the markdown file to a PDF using pandoc: npx markdown-pdf ./output.md
 *
 * Usage: node --experimental-strip-types tomd.ts [options]
 * @author Amirhossein Esmaeili
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Function to read and parse .gitignore if it exists
async function getIgnoredPaths(): Promise<Set<RegExp>> {
  const ignoredPaths = new Set<RegExp>();

  try {
    const gitignoreContent = await fs.readFile('.gitignore', 'utf-8');
    const gitignoreDir = path.dirname('.gitignore');
    gitignoreContent.split('\n').forEach((line) => {
      let trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        if (trimmed.startsWith('/')) {
          trimmed = trimmed.substring(1);
        }
        if (trimmed.includes('*')) {
          trimmed = trimmed.replaceAll('*', '*.*');
        }
        ignoredPaths.add(new RegExp(path.resolve(gitignoreDir, trimmed).replace(/[+?^${}()|[\]\\]/g, '\\$&')));
      }
    });
  } catch (error) {
    // No .gitignore found, or error reading it, ignore silently
  }

  return ignoredPaths;
}

// Function to recursively get files from a directory, respecting .gitignore
async function getFiles(dir: string, extRegex: RegExp, ignoredPaths: Set<RegExp>): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.flatMap(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      const resolvedPath = path.resolve(fullPath);

      // Skip ignored paths
      if (ignoredPaths.size > 0) {
        for (const ignoredPath of ignoredPaths) {
          if (ignoredPath.test(resolvedPath)) {
            return [];
          }
        }
      }

      if (entry.isDirectory()) {
        return getFiles(fullPath, extRegex, ignoredPaths);
      } else if (extRegex.test(fullPath)) {
        return fullPath;
      }
      return [];
    })
  );
  return files.flat();
}

// Function to create a markdown file with file content
async function createMarkdown(files: string[], outputPath: string) {
  let markdownContent = '';
  let totalFiles = files.length;

  for (let i = 0; i < totalFiles; i++) {
    const file = files[i];
    const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/');
    const fileName = path.basename(file);
    const content = await fs.readFile(file, 'utf-8');

    // Update progress
    logProgress(`Processing: ${relativePath}`, i + 1, totalFiles);

    markdownContent += `# ${fileName} (${relativePath})\n\n`;
    markdownContent += '```' + path.extname(file).substring(1) + '\n';
    markdownContent += content + '\n';
    markdownContent += '```\n\n';
  }

  // Clear the final log and write output
  clearProgress();
  await fs.writeFile(outputPath, markdownContent);
  console.log(`Markdown file created at ${outputPath}`);
}

// Helper function to log progress in the terminal
function logProgress(message: string, current: number, total: number) {
  const percentage = ((current / total) * 100).toFixed(2);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`${message} - ${percentage}% complete`);
}

// Helper function to clear the progress message
function clearProgress() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}

// Interface for options
interface Options {
  input?: string;
  ext?: RegExp;
  output?: string;
  ignoreGitignore?: boolean;
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const options: Options = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-i':
      case '--input':
        options.input = args[i + 1];
        i++;
        break;
      case '-e':
      case '--ext':
        options.ext = args[i + 1] as unknown as RegExp;
        i++;
        break;
      case '-o':
      case '--output':
        options.output = args[i + 1];
        i++;
        break;
      case '-g':
      case '--ignoreGitignore':
        options.ignoreGitignore = args[i + 1] === 'false' ? false : true;
        i++;
        break;
    }
  }

  const {
    input = './',
    ext = new RegExp('\\.(ts|tsx|js|jsx|mjs|cjs)$'),
    output = 'output.md',
    ignoreGitignore = true,
  } = options;

  try {
    let ignoredPaths = new Set<RegExp>();
    if (ignoreGitignore) {
      ignoredPaths = await getIgnoredPaths();
    }

    const files = await getFiles(input, ext, ignoredPaths);
    if (files.length === 0) {
      console.log('No files found with the specified extension.');
    } else {
      await createMarkdown(files, output);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
