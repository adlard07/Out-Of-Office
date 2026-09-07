import { PageShell } from "@/components/layout/PageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export function NotFoundBlock({
  title = "We can't find that one",
  message = "It may have been removed, or the link is a little off.",
  href = "/discover",
  cta = "Back to discover",
}: {
  title?: string;
  message?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <PageShell>
      <EmptyState emoji="🧳" title={title} action={<ButtonLink href={href}>{cta}</ButtonLink>}>
        {message}
      </EmptyState>
    </PageShell>
  );
}
