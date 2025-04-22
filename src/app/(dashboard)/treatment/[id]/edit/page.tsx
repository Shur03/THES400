import TreatmentForm from "@/components/page/Treatment/TreatmentForm";

export default function EditTreatmentPage({
  params,
}: {
  params: { id: string };
}) {
  return <TreatmentForm mode="edit" treatmentId={params.id} />;
}
