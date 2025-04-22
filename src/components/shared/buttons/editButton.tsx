"use client";
import { Pencil } from "lucide-react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface EditButtonProps {
  id: number | string;
  path: string;
  size?: "sm" | "lg";
  className?: string;
  iconSize?: number;
  iconClassName?: string;
}

export function EditButton({
  id,
  path,
  size = "sm",
  className = "p-1.5 rounded-full hover:bg-blue-50",
  iconSize = 16,
  iconClassName = "text-blue-600",
}: EditButtonProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/${path}/${id}/edit`);
  };

  return (
    <Button
      variant="outline-primary"
      size={size}
      onClick={handleEdit}
      className={className}
    >
      <Pencil size={iconSize} className={iconClassName} />
    </Button>
  );
}
