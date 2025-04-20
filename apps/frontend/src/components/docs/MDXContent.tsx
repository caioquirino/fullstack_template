'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Highlight, themes } from 'prism-react-renderer'

interface MDXContentProps {
  children: React.ReactNode
}

interface CodeProps {
  className?: string
  children: string
}

interface PreProps {
  children: React.ReactElement<CodeProps>
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const { resolvedTheme } = useTheme()
  const language = className?.replace(/language-/, '') || 'typescript'

  return (
    <Highlight theme={resolvedTheme === 'dark' ? themes.vsDark : themes.vsLight} code={children.trim()} language={language as any}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} overflow-x-auto`}
          style={{
            ...style,
            padding: '1rem',
            borderRadius: '0.375rem',
            margin: 0,
          }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="whitespace-pre">
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export function MDXContent({ children }: MDXContentProps) {
  return (
    <div className="mdx-content">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<PreProps>(child)) {
          if (child.type === 'pre') {
            const codeChild = React.Children.toArray(child.props.children)[0] as React.ReactElement<CodeProps>
            if (codeChild && codeChild.type === 'code') {
              return <CodeBlock className={codeChild.props.className}>{codeChild.props.children}</CodeBlock>
            }
          }
        }
        return child
      })}
    </div>
  )
}
