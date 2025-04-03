import { z } from "zod";

const schema = z.object({
  type: z.string().min(3).max(255),
  quamtity_used: z.number().min(0).max(255),
  used_date: z.date(),
  weight: z.number().min(0).max(255),
  counts: z.number().min(0).max(255),
  buy_date: z.date(),
});

type FormState = {
  success: boolean;
  message: string;
  scrollTop: boolean;
  formKey: number;
  errors?: {
    [key in keyof typeof schema.shape]?: string[];
  };
};
export default async function create(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  //Өвс тэжээлийн бүртгэлийн талбаруудыг шалгах
  const validatedFields = schema.safeParse({
    type: formData.get("type"),
    quamtity_used: formData.get("quamtity_used"),
    used_date: formData.get("used_date"),
    weight: formData.get("weight"),
    counts: formData.get("counts"),
    buy_date: formData.get("buy_date"),
  });
  // Амжилттай
  if (!validatedFields.success) {
    return {
      success: false,
      scrollTop: false,
      formKey: prevState.formKey,
      message: "Validation error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Алдаа
  if (validatedFields.data.type === "error") {
    return {
      success: false,
      scrollTop: true,
      formKey: prevState.formKey,
      message: "Алдаа гарлаа. Ахин оролдоно уу.",
    };
  } else {
    return {
      success: true,
      scrollTop: true,
      formKey: prevState.formKey + 1,
      message: "Амжилттай хадгалагдлаа.",
    };
  }
}
