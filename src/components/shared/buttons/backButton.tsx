import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      type="reset"
      variant="secondary"
      onClick={() => router.back()}
      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
    >
      Буцах
    </Button>
  );
}
