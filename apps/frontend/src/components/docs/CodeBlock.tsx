import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: '1rem',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        backgroundColor: '#1e1e1e',
        borderRadius: '0.5rem',
      }}>
      {code}
    </SyntaxHighlighter>
  )
}
