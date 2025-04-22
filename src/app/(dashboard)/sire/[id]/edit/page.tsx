import SireForm from "@/components/page/Sire/SireForm";

export default function EditSiretPage({ params }: { params: { id: string } }) {
  return <SireForm mode="edit" sireId={params.id} />;
}
