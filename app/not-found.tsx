import { NotFoundBlock } from "@/components/ui/NotFoundBlock";

export default function NotFound() {
  return (
    <NotFoundBlock
      title="This path doesn't lead anywhere"
      message="Every good trip has one wrong turn. Let's get back on track."
      href="/"
      cta="Take me home"
    />
  );
}
