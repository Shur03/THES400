"use client";
import { Trash2 } from "lucide-react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: number;
  endpoint: string;
  itemName?: string;
  size?: "sm" | "lg";
  refreshMethod?: "router" | "reload";
  className?: string;
}

export function DeleteButton({
  id,
  endpoint,
  itemName = "энэ бичлэг",
  size = "sm",
  refreshMethod = "router",
  className = "p-1.5 rounded-full hover:bg-red-50",
}: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Та ${itemName} устгахдаа итгэлтэй байна уу?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (refreshMethod === "router") {
          router.refresh();
        } else {
          window.location.reload();
        }
        alert("Амжилттай устгалаа");
      } else {
        throw new Error("Устгах явцад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Устгах явцад алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  return (
    <Button
      variant="outline-danger"
      size={size}
      onClick={handleDelete}
      className={className}
    >
      <Trash2 size={16} className="text-red-600" />
    </Button>
  );
}
