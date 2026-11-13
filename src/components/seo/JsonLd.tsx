interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>> | null | undefined;
}

export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;
  if (Array.isArray(data) && data.length === 0) return null;
  if (typeof data === "object" && Object.keys(data).length === 0) return null;

  // JSON escaped with < replaced as \u003c to prevent script injection / XSS
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

