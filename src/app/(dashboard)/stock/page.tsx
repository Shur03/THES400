import StockForm from "@/components/page/Stock/StockForm";
import StockList from "@/components/page/Stock/StockList";

export default function Page() {
  return (
    <div>
      <h1>Малын бүртгэл</h1>
      <StockForm />
      <StockList />
    </div>
  );
}
