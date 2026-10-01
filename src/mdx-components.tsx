import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="mb-4 mt-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-3 mt-8 text-2xl font-bold tracking-tight text-foreground md:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-3 mt-6 text-xl font-semibold text-foreground md:text-2xl"
      {...props}
    />
  ),
  h4: (props) => (
    <h4 className="mb-2 mt-5 text-lg font-semibold text-foreground" {...props} />
  ),
  p: (props) => (
    <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mb-4 border-l-2 border-primary/40 pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-secondary px-1.5 py-0.5 text-sm text-foreground"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
