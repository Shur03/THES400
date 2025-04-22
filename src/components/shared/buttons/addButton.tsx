import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
interface AddButtonProps {
  path: string;
}
export default function AddButton({ path }: AddButtonProps) {
  const router = useRouter();
  const handleAdd = () => {
    router.push(`/${path}/create`);
  };
  return (
    <div className="mb-3 text-end pt-5">
      <Button
        variant="success"
        className="text-white bg-green-400 rounded-lg p-2 "
        onClick={handleAdd}
      >
        + Бүртгэл нэмэх
      </Button>
    </div>
  );
}
