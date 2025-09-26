import Link from "next/link";
import Button from "./Button";

export default function BackButton({ route }: { route: string }) {
  return (
    <Link href={route}>
      <Button isPending={false} inscription="Back" style={{ marginBottom: "15px" }} />
    </Link>
  );
}
