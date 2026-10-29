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

// Preact's virtual DOM includes a handler for dangerouslySetInnerHTML (e.g. node.innerHTML = prop.__html),
// which triggers UNSAFE_VAR_ASSIGNMENT even when we do not use it in our own code.
//
// Why not use official flags?
// 1. web-ext lint has no flag to ignore specific warning codes (only --ignore-files for whole files).
// 2. addons-linter has --disable-linter-rules, but disabling no-unsanitized completely
//    would stop checking innerHTML across our entire codebase, hiding real security risks in our code.
//
// Therefore, we allowlist only these 2 known warnings from Preact's bundle
// and treat all other unexpected warnings or errors as failures.
const isAllowedWarning = (warning: LintIssue): boolean => {
  return warning.code === 'UNSAFE_VAR_ASSIGNMENT'
    && (warning.file === 'options.js' || warning.file === 'popup.js');
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

const unexpectedErrors = result.errors;
const unexpectedWarnings = result.warnings.filter((w) => !isAllowedWarning(w));

if (unexpectedErrors.length > 0 || unexpectedWarnings.length > 0) {
  if (unexpectedErrors.length > 0) {
    console.error('Firefox lint errors:', unexpectedErrors);
  }
  if (unexpectedWarnings.length > 0) {
    console.error('Firefox unexpected lint warnings:', unexpectedWarnings);
  }
  process.exit(1);
}

console.log(
  `Firefox package passed lint check (${result.warnings.length} known Preact warnings allowed).`,
);
