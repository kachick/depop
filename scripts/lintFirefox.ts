import { execFileSync } from 'node:child_process';

type LintIssue = {
  code: string;
  file?: string;
  message?: string;
  description?: string;
  line?: number;
  column?: number;
};

type LintResult = {
  summary: {
    errors: number;
    warnings: number;
    notices: number;
  };
  errors: LintIssue[];
  warnings: LintIssue[];
  notices: LintIssue[];
};

let rawOutput = '';
try {
  rawOutput = execFileSync('web-ext', ['lint', '--source-dir', 'dist/firefox', '--output', 'json'], {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });
} catch (error: unknown) {
  const execError = error as { stdout?: string };
  if (typeof execError.stdout === 'string' && execError.stdout.trim().length > 0) {
    rawOutput = execError.stdout;
  } else {
    throw error;
  }
}

const result = JSON.parse(rawOutput) as LintResult;

if (result.errors.length > 0 || result.warnings.length > 0) {
  if (result.errors.length > 0) {
    console.error('Firefox lint errors:', result.errors);
  }
  if (result.warnings.length > 0) {
    console.error('Firefox lint warnings:', result.warnings);
  }
  process.exit(1);
}

console.log('Firefox package passed lint check with 0 warnings.');
