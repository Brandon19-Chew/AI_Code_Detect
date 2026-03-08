export type Language =
  | 'JavaScript'
  | 'TypeScript'
  | 'Python'
  | 'Java'
  | 'C'
  | 'C++'
  | 'C#'
  | 'Go'
  | 'Rust'
  | 'PHP'
  | 'Ruby'
  | 'Swift'
  | 'Kotlin'
  | 'Dart'
  | 'Scala'
  | 'Haskell'
  | 'Lua'
  | 'R'
  | 'Perl'
  | 'Elixir'
  | 'Groovy'
  | 'PowerShell'
  | 'Terraform'
  | 'Dockerfile'
  | 'GraphQL'
  | 'XML'
  | 'TOML'
  | 'Assembly'
  | 'Vue'
  | 'Svelte'
  | 'HTML'
  | 'CSS'
  | 'SQL'
  | 'Shell'
  | 'JSON'
  | 'YAML'
  | 'Markdown'
  | 'Unknown';

export type ResultTab = 'explanation' | 'improvements' | 'comments';

export interface AnalysisResult {
  language: Language;
  confidence: number;
  explanation: ExplanationSection[];
  improvements: Improvement[];
  comments: string;
  linesOfCode: number;
  complexity: 'Low' | 'Medium' | 'High';
}

export interface ExplanationSection {
  title: string;
  content: string;
}

export interface Improvement {
  category: 'Performance' | 'Readability' | 'Security' | 'Best Practice' | 'Error Handling';
  severity: 'info' | 'warning' | 'error';
  description: string;
  suggestion: string;
}
