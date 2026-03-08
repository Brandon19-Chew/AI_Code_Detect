import type { Language, AnalysisResult, Improvement, ExplanationSection } from '@/types';

export function detectLanguage(code: string): { language: Language; confidence: number } {
  const trimmed = code.trim();

  const patterns: Array<{ language: Language; patterns: RegExp[]; weight: number }> = [
    {
      language: 'Python',
      patterns: [/def\s+\w+\s*\(/, /import\s+\w+/, /from\s+\w+\s+import/, /:\s*$/, /print\s*\(/, /elif\s/, /__init__/, /self\./],
      weight: 0,
    },
    {
      language: 'JavaScript',
      patterns: [/const\s+\w+\s*=/, /let\s+\w+/, /var\s+\w+/, /=>\s*{/, /console\.log\(/, /function\s+\w+\s*\(/, /require\(/, /module\.exports/],
      weight: 0,
    },
    {
      language: 'TypeScript',
      patterns: [/:\s*(string|number|boolean|void|any|never)/, /interface\s+\w+/, /type\s+\w+\s*=/, /<\w+>/, /as\s+\w+/, /readonly\s/, /enum\s+\w+/],
      weight: 0,
    },
    {
      language: 'Java',
      patterns: [/public\s+(class|static|void|int)/, /System\.out\.print/, /import\s+java\./, /private\s+\w+/, /new\s+\w+\(/, /@Override/, /extends\s+\w+/],
      weight: 0,
    },
    {
      language: 'C++',
      patterns: [/#include\s*</, /std::/, /cout\s*<</, /cin\s*>>/, /namespace\s+\w+/, /template\s*</, /nullptr/],
      weight: 0,
    },
    {
      language: 'C',
      patterns: [/#include\s*<stdio\.h>/, /printf\s*\(/, /scanf\s*\(/, /int\s+main\s*\(/, /malloc\s*\(/, /struct\s+\w+/],
      weight: 0,
    },
    {
      language: 'C#',
      patterns: [/using\s+System/, /namespace\s+\w+/, /public\s+class/, /Console\.Write/, /async\s+Task/, /\.NET/, /\[Attribute\]/],
      weight: 0,
    },
    {
      language: 'Go',
      patterns: [/package\s+main/, /func\s+\w+\s*\(/, /fmt\.Print/, /import\s+"/, /:=\s/, /go\s+func/, /chan\s+\w+/],
      weight: 0,
    },
    {
      language: 'Rust',
      patterns: [/fn\s+\w+\s*\(/, /let\s+mut\s+/, /println!\(/, /use\s+std::/, /impl\s+\w+/, /pub\s+fn/, /->\s+\w+\s*{/],
      weight: 0,
    },
    {
      language: 'PHP',
      patterns: [/<\?php/, /\$\w+\s*=/, /echo\s+/, /function\s+\w+/, /->/, /namespace\s+\w+/, /require_once/],
      weight: 0,
    },
    {
      language: 'Ruby',
      patterns: [/def\s+\w+/, /puts\s+/, /require\s+'/, /\.each\s+do/, /end$/, /attr_accessor/, /class\s+\w+\s*</],
      weight: 0,
    },
    {
      language: 'Swift',
      patterns: [/import\s+UIKit/, /var\s+\w+:\s*\w+/, /func\s+\w+\s*\(/, /let\s+\w+:\s*\w+/, /guard\s+let/, /@IBOutlet/, /override\s+func/],
      weight: 0,
    },
    {
      language: 'Kotlin',
      patterns: [/fun\s+\w+\s*\(/, /val\s+\w+/, /var\s+\w+:\s*\w+/, /data\s+class/, /companion\s+object/, /suspend\s+fun/, /\.also\s*{/],
      weight: 0,
    },
    {
      language: 'HTML',
      patterns: [/<html/, /<div/, /<body/, /<head/, /<script/, /<style/, /<!DOCTYPE/],
      weight: 0,
    },
    {
      language: 'CSS',
      patterns: [/\.\w+\s*{/, /#\w+\s*{/, /:\s*hover/, /margin:\s*/, /padding:\s*/, /@media\s*\(/, /display:\s*flex/],
      weight: 0,
    },
    {
      language: 'SQL',
      patterns: [/SELECT\s+/i, /FROM\s+\w+/i, /WHERE\s+/i, /INSERT\s+INTO/i, /CREATE\s+TABLE/i, /JOIN\s+\w+/i, /GROUP\s+BY/i],
      weight: 0,
    },
    {
      language: 'Shell',
      patterns: [/^#!\/bin\//, /\$\(\w+\)/, /echo\s+"/, /if\s+\[/, /for\s+\w+\s+in/, /chmod\s+/, /grep\s+/],
      weight: 0,
    },
    {
      language: 'JSON',
      patterns: [/^\s*{/, /"\w+":\s*"/, /"\w+":\s*\[/, /"\w+":\s*{/, /^\s*\[/],
      weight: 0,
    },
    {
      language: 'YAML',
      patterns: [/^\w+:\s*$/, /^\s+-\s+\w+/, /---$/, /\w+:\s+\w+/, /^\s{2}\w+:/],
      weight: 0,
    },
    {
      language: 'Dart',
      patterns: [/void main\(\)/, /import 'package:flutter/, /Widget build\(/, /StatefulWidget|StatelessWidget/, /\bfinal\s+\w+\s+\w+\s*=/, /async\s*{/, /await\s+\w+\(/],
      weight: 0,
    },
    {
      language: 'Scala',
      patterns: [/^object\s+\w+/, /def\s+\w+.*:\s*\w+\s*=/, /val\s+\w+\s*:/, /case\s+class\s+\w+/, /extends\s+App/, /implicit\s+/, /\bMatch\b|\bcase\b.*=>/, /println\(/],
      weight: 0,
    },
    {
      language: 'Haskell',
      patterns: [/^module\s+\w+/, /^import\s+Data\./, /^\w+\s+::\s+/, /where$/, /\blet\b.*\bin\b/, /do$/, /\bguard\b|\bmaybe\b/, /\|\s+\w+/],
      weight: 0,
    },
    {
      language: 'Lua',
      patterns: [/^local\s+\w+/, /function\s+\w+.*\)/, /end$/, /require\s*\(/, /\bprint\s*\(/, /--\s+/, /\bnil\b/, /\bipairs\b|\bpairs\b/],
      weight: 0,
    },
    {
      language: 'R',
      patterns: [/<-\s+/, /^library\(/, /\bdata\.frame\b/, /\bc\(/, /\bggplot\b/, /\bsapply\b|\blapply\b/, /print\(/, /\bNA\b/],
      weight: 0,
    },
    {
      language: 'Perl',
      patterns: [/^use\s+strict/, /^use\s+warnings/, /\bmy\s+\$/, /\bsub\s+\w+/, /\bprint\b.*\n/, /\bregex\b|qr\//, /\bdie\s/, /=~\s*\/.*\//],
      weight: 0,
    },
    {
      language: 'Elixir',
      patterns: [/^defmodule\s+\w+/, /\bdef\s+\w+.*do$/, /\bdo$/, /\|>\s+/, /IO\.puts/, /\bcase\b.*\bdo\b/, /\bEnum\./, /%\w+{/],
      weight: 0,
    },
    {
      language: 'Groovy',
      patterns: [/^def\s+\w+\s*=/, /println\s+/, /\.each\s*{/, /\bclass\s+\w+\s+extends/, /\bimport\s+groovy\./, /\[.*\]\.collect/, /\$\{\w+\}/],
      weight: 0,
    },
    {
      language: 'PowerShell',
      patterns: [/^\$\w+\s*=/, /Write-Host\s/, /Get-\w+|Set-\w+|New-\w+/, /\bParam\s*\(/, /\bfunction\s+\w+-\w+/, /-\w+\s+\$\w+/, /foreach\s*\(/, /\$_/],
      weight: 0,
    },
    {
      language: 'Terraform',
      patterns: [/^resource\s+"\w+"/, /^provider\s+"\w+"/, /^variable\s+"\w+"/, /^output\s+"\w+"/, /^module\s+"\w+"/, /\bterraform\s+{/, /\bdata\s+"\w+"\s+"/],
      weight: 0,
    },
    {
      language: 'Dockerfile',
      patterns: [/^FROM\s+\w+/, /^RUN\s+/, /^CMD\s+/, /^COPY\s+/, /^ADD\s+/, /^ENV\s+\w+/, /^EXPOSE\s+\d+/, /^WORKDIR\s+/],
      weight: 0,
    },
    {
      language: 'GraphQL',
      patterns: [/^type\s+\w+\s*{/, /^query\s+\w*\s*{/, /^mutation\s+\w+\s*{/, /^schema\s*{/, /^fragment\s+\w+\s+on/, /!$/, /\bEnum\s+\w+/, /\bInput\s+\w+/],
      weight: 0,
    },
    {
      language: 'XML',
      patterns: [/<\?xml\s+version/, /<\/\w+>/, /<\w+\s+\w+=/, /xmlns:/, /<\w+\/>/, /<!\[CDATA\[/],
      weight: 0,
    },
    {
      language: 'TOML',
      patterns: [/^\[\w+\]$/, /^\w+\s*=\s*"/, /^\w+\s*=\s*\[/, /^\[\[\w+\]\]$/, /^\w+\s*=\s*true|false/, /^#.*$/m],
      weight: 0,
    },
    {
      language: 'Assembly',
      patterns: [/\b(mov|push|pop|jmp|call|ret|xor|add|sub|mul|div|lea|cmp|je|jne)\b/i, /section\s+\.\w+/, /global\s+_start/, /\bdword\b|\bqword\b/, /\beax|ebx|ecx|edx|rax|rbx\b/],
      weight: 0,
    },
    {
      language: 'Vue',
      patterns: [/<template>/, /<script\s+setup/, /<style\s+scoped/, /defineComponent\(/, /defineProps\(/, /ref\(\)/, /computed\(\)/],
      weight: 0,
    },
    {
      language: 'Svelte',
      patterns: [/<script>/, /\$:\s+/, /export\s+let\s+\w+/, /on:\w+=/, /bind:\w+=/, /\{#if\s+/, /\{#each\s+/],
      weight: 0,
    },
    {
      language: 'Markdown',
      patterns: [/^#+\s+\w+/, /^\*\*\w+\*\*/, /^-\s+\w+/, /^\d+\.\s+/, /^>\s+/, /^```\w*$/, /\[\w+\]\(http/],
      weight: 0,
    },
  ];

  for (const entry of patterns) {
    for (const pattern of entry.patterns) {
      if (pattern.test(trimmed)) {
        entry.weight += 1;
      }
    }
  }

  // TypeScript and JavaScript share many patterns, boost TS if types found
  const tsEntry = patterns.find(p => p.language === 'TypeScript');
  const jsEntry = patterns.find(p => p.language === 'JavaScript');
  if (tsEntry && jsEntry && tsEntry.weight > 0) {
    tsEntry.weight += jsEntry.weight * 0.5;
  }

  const sorted = [...patterns].sort((a, b) => b.weight - a.weight);
  const top = sorted[0];

  if (top.weight === 0) return { language: 'Unknown', confidence: 0 };

  const total = sorted.reduce((sum, p) => sum + p.weight, 0);
  const confidence = Math.min(Math.round((top.weight / total) * 100) + 20, 98);

  return { language: top.language, confidence };
}

function countLines(code: string): number {
  return code.split('\n').filter(l => l.trim().length > 0).length;
}

function assessComplexity(code: string, lines: number): 'Low' | 'Medium' | 'High' {
  const controlFlow = (code.match(/\b(if|else|for|while|switch|try|catch|forEach|map|filter|reduce)\b/g) || []).length;
  const nesting = (code.match(/[{(]/g) || []).length;
  const score = lines + controlFlow * 2 + nesting * 0.5;
  if (score < 30) return 'Low';
  if (score < 80) return 'Medium';
  return 'High';
}

function generateExplanation(code: string, language: Language): ExplanationSection[] {
  const lines = countLines(code);
  const hasFunctions = /function|def |fn |func |=>|sub |method/.test(code);
  const hasClasses = /class\s+\w+/.test(code);
  const hasLoops = /\b(for|while|forEach|map|filter|reduce)\b/.test(code);
  const hasConditionals = /\b(if|else|switch|elif|ternary)\b/.test(code);
  const hasAsync = /\b(async|await|Promise|then|callback|coroutine|goroutine)\b/.test(code);
  const hasImports = /\b(import|require|include|using|use)\b/.test(code);

  const sections: ExplanationSection[] = [];

  sections.push({
    title: 'Overview',
    content: `This is a ${lines}-line ${language} snippet that ${
      hasClasses ? 'defines one or more classes with associated methods and properties' :
      hasFunctions ? 'implements a set of functions to perform specific operations' :
      'executes a sequence of statements to accomplish a task'
    }. ${hasImports ? 'It begins by importing external dependencies or modules. ' : ''}The overall structure is ${lines < 20 ? 'concise and focused on a single responsibility' : lines < 60 ? 'moderately sized with clear logical sections' : 'substantial, covering multiple responsibilities across several blocks'}.`,
  });

  if (hasLoops || hasConditionals) {
    sections.push({
      title: 'Control Flow',
      content: `The code uses ${[
        hasLoops ? 'iterative constructs (loops) to process collections or repeat operations' : '',
        hasConditionals ? 'conditional branching to handle different cases or validate inputs' : '',
      ].filter(Boolean).join(' and ')}. ${
        hasLoops && hasConditionals ? 'The combination of loops and conditionals suggests this code is handling data transformations or filtering logic.' : ''
      }`,
    });
  }

  if (hasAsync) {
    sections.push({
      title: 'Asynchronous Patterns',
      content: `This code employs asynchronous programming techniques, indicating it performs non-blocking operations — such as network requests, file I/O, or time-delayed tasks. The async/await or promise-based pattern ensures the program remains responsive while waiting for these operations to complete.`,
    });
  }

  if (hasClasses) {
    sections.push({
      title: 'Object-Oriented Design',
      content: `The use of classes suggests an object-oriented design approach. Classes encapsulate related data and behavior together, promoting reusability and maintainability. Look for the constructor (initialization), public methods (interface), and private members (internal state) to understand the class's responsibilities.`,
    });
  }

  sections.push({
    title: 'Data Flow',
    content: `Data appears to enter this code through ${
      /\(.*\)/.test(code) ? 'function parameters or method arguments' : 'variable declarations'
    }, gets processed through the core logic, and ${
      /return\s/.test(code) ? 'results are returned to the caller' :
      /print|console|output|cout|puts|echo/.test(code) ? 'output is sent to the console or display' :
      'the final state is stored in variables or data structures'
    }. This pattern is typical of ${language} applications following standard conventions.`,
  });

  return sections;
}

function generateImprovements(code: string, language: Language): Improvement[] {
  const improvements: Improvement[] = [];
  const hasMagicNumbers = /[^"'a-zA-Z_]\b([2-9][0-9]+|[0-9]{3,})\b/.test(code);
  const hasVarInJS = language === 'JavaScript' && /\bvar\s+/.test(code);
  const hasNoErrorHandling = !/try|catch|except|rescue|error|Error|throw/.test(code);
  const hasLongLines = code.split('\n').some(l => l.length > 100);
  const hasNestedLoops = (code.match(/for|while/g) || []).length > 1;
  const hasConsoleLog = /console\.log\(/.test(code) && language !== 'JavaScript';
  const hasHardcodedStrings = (code.match(/"[a-zA-Z0-9._%+\-@]+\.[a-zA-Z]{2,}"/g) || []).length > 0;
  const hasTodoComments = /TODO|FIXME|HACK|XXX/.test(code);
  const hasDoubleEquals = language === 'JavaScript' && /[^=!]==[^=]/.test(code);

  if (hasVarInJS) {
    improvements.push({
      category: 'Best Practice',
      severity: 'warning',
      description: 'Use of `var` keyword detected',
      suggestion: 'Replace `var` with `const` or `let`. `var` has function scope and can lead to unexpected hoisting behavior. `const` for values that won\'t be reassigned, `let` for values that will.',
    });
  }

  if (hasMagicNumbers) {
    improvements.push({
      category: 'Readability',
      severity: 'info',
      description: 'Magic numbers found in code',
      suggestion: 'Extract numeric literals into named constants (e.g., `const MAX_RETRIES = 3`). This makes the code self-documenting and easier to update.',
    });
  }

  if (hasNoErrorHandling && code.length > 100) {
    improvements.push({
      category: 'Error Handling',
      severity: 'warning',
      description: 'No error handling detected',
      suggestion: 'Add try/catch blocks around operations that may fail (I/O, network requests, parsing). Graceful error handling prevents crashes and improves user experience.',
    });
  }

  if (hasLongLines) {
    improvements.push({
      category: 'Readability',
      severity: 'info',
      description: 'Some lines exceed 100 characters',
      suggestion: 'Break long lines at logical points. Most style guides recommend a maximum line length of 80–100 characters for better readability across different editors and screens.',
    });
  }

  if (hasNestedLoops) {
    improvements.push({
      category: 'Performance',
      severity: 'warning',
      description: 'Nested loops detected — potential O(n²) complexity',
      suggestion: 'Consider refactoring nested loops using data structures like Maps or Sets for lookups, or break the problem into smaller functions. This can dramatically improve performance for large datasets.',
    });
  }

  if (hasDoubleEquals) {
    improvements.push({
      category: 'Best Practice',
      severity: 'error',
      description: 'Loose equality (`==`) used instead of strict equality (`===`)',
      suggestion: 'Always use `===` in JavaScript. Loose equality performs type coercion which can lead to subtle, hard-to-debug bugs (e.g., `0 == ""` is `true`).',
    });
  }

  if (hasHardcodedStrings) {
    improvements.push({
      category: 'Security',
      severity: 'warning',
      description: 'Hardcoded URLs or sensitive strings detected',
      suggestion: 'Move configuration values (URLs, API endpoints, credentials) to environment variables or a configuration file. This improves security and makes deployment across environments easier.',
    });
  }

  if (hasTodoComments) {
    improvements.push({
      category: 'Best Practice',
      severity: 'info',
      description: 'TODO/FIXME comments present',
      suggestion: 'Address or track TODO/FIXME comments using your issue tracker. Lingering technical debt comments can accumulate and mislead other developers.',
    });
  }

  if (improvements.length === 0) {
    improvements.push({
      category: 'Best Practice',
      severity: 'info',
      description: 'Code appears well-structured',
      suggestion: 'The code follows good practices. Consider adding unit tests to verify behavior, and ensure functions are documented with JSDoc or equivalent for your language.',
    });
  }

  return improvements;
}

function generateComments(code: string, language: Language): string {
  const lines = code.split('\n');
  const commentStyle = getCommentStyle(language);

  const commented = lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(commentStyle.single) || trimmed.startsWith('*')) {
      return line;
    }

    const comment = inferComment(trimmed, language);
    if (comment && index === 0) {
      return `${commentStyle.single} ${comment}\n${line}`;
    }
    if (comment) {
      const indent = line.match(/^(\s*)/)?.[1] ?? '';
      return `${indent}${commentStyle.single} ${comment}\n${line}`;
    }
    return line;
  });

  const header = buildFileHeader(code, language, commentStyle);
  return header + commented.join('\n');
}

function getCommentStyle(lang: Language) {
  if (['Python', 'Ruby', 'Shell', 'YAML', 'R', 'Perl', 'Elixir', 'PowerShell', 'Terraform', 'Dockerfile', 'TOML'].includes(lang)) {
    return { single: '#', blockStart: '"""', blockEnd: '"""' };
  }
  if (['HTML', 'XML', 'Vue', 'Svelte', 'Markdown'].includes(lang)) {
    return { single: '<!--', blockStart: '<!--', blockEnd: '-->' };
  }
  if (lang === 'CSS') {
    return { single: '//', blockStart: '/*', blockEnd: '*/' };
  }
  if (['SQL', 'Haskell'].includes(lang)) {
    return { single: '--', blockStart: '/*', blockEnd: '*/' };
  }
  if (lang === 'Lua') {
    return { single: '--', blockStart: '--[[', blockEnd: '--]]' };
  }
  if (lang === 'Assembly') {
    return { single: ';', blockStart: ';', blockEnd: '' };
  }
  return { single: '//', blockStart: '/**', blockEnd: ' */' };
}

function inferComment(line: string, _lang: Language): string {
  if (/^(import|require|include|using|use)\s/.test(line)) return 'Import external dependency';
  if (/^(export\s+)?(default\s+)?(class)\s+/.test(line)) return 'Class definition';
  if (/^(export\s+)?(default\s+)?(function|def|func|fn|sub)\s+/.test(line)) return 'Function definition';
  if (/\breturn\b/.test(line)) return 'Return computed result to caller';
  if (/\b(if|else if|elif)\b/.test(line)) return 'Conditional check';
  if (/\bfor\b.*\bin\b/.test(line)) return 'Iterate over collection';
  if (/\bwhile\b/.test(line)) return 'Loop while condition holds';
  if (/\btry\b/.test(line)) return 'Begin error-handled block';
  if (/\bcatch|except\b/.test(line)) return 'Handle errors gracefully';
  if (/console\.log|print\(|puts\s|echo\s/.test(line)) return 'Output value for debugging or display';
  if (/const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=/.test(line)) return 'Declare and initialize variable';
  if (/=>\s*{?/.test(line) || /lambda/.test(line)) return 'Arrow/lambda function';
  return '';
}

function buildFileHeader(code: string, language: Language, style: { single: string; blockStart: string; blockEnd: string }): string {
  const hasFunctions = /function|def |fn |func |=>/.test(code);
  const hasClasses = /class\s+\w+/.test(code);

  if (language === 'Python' || language === 'R') {
    return `"""\nModule Description:\n  ${hasClasses ? 'Defines classes and associated logic.' : hasFunctions ? 'Provides utility functions.' : 'Script entry point.'}\n\nAuthor: [Author Name]\nDate: ${new Date().toISOString().split('T')[0]}\n"""\n\n`;
  }

  if (['Lua', 'Haskell'].includes(language)) {
    return `-- ============================================\n-- Description: ${hasClasses ? 'Class definitions.' : hasFunctions ? 'Utility functions.' : 'Script logic.'}\n-- Author: [Author Name]\n-- Date: ${new Date().toISOString().split('T')[0]}\n-- ============================================\n\n`;
  }

  if (['PowerShell'].includes(language)) {
    return `<#\n.SYNOPSIS\n  ${hasFunctions ? 'PowerShell script with utility functions.' : 'PowerShell automation script.'}\n.AUTHOR\n  [Author Name]\n.DATE\n  ${new Date().toISOString().split('T')[0]}\n#>\n\n`;
  }

  if (['JavaScript', 'TypeScript', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Kotlin', 'Swift', 'Dart', 'Scala', 'Groovy', 'Elixir'].includes(language)) {
    return `/**\n * @fileoverview ${hasClasses ? 'Class definitions and object-oriented logic.' : hasFunctions ? 'Utility functions and helpers.' : 'Application logic and entry point.'}\n * @author [Author Name]\n * @date ${new Date().toISOString().split('T')[0]}\n */\n\n`;
  }

  return '';
}

export function analyzeCode(code: string): AnalysisResult {
  const { language, confidence } = detectLanguage(code);
  const lines = countLines(code);
  const complexity = assessComplexity(code, lines);
  const explanation = generateExplanation(code, language);
  const improvements = generateImprovements(code, language);
  const comments = generateComments(code, language);

  return {
    language,
    confidence,
    explanation,
    improvements,
    comments,
    linesOfCode: lines,
    complexity,
  };
}
