"use client";

import * as runtime from "react/jsx-runtime";
import { useMemo } from "react";

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMemo(() => {
    const fn = new Function(code);
    return fn({ ...runtime }).default;
  }, [code]);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Component />
    </div>
  );
}
