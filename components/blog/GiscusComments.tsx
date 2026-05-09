"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID!;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY!;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!;

  if (!repo || !repoId || !category || !categoryId) return null;

  return (
    <div className="mt-12 pt-8 border-t">
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="vi"
        loading="lazy"
      />
    </div>
  );
}
