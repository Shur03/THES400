import { FodderStock } from "@/models/Fodder";
import Form from "./Form";
type Props = {
  fodder?: FodderStock;
};
// const fetchTypes = async () Promise<FodderType[]>{

// }
export default async function RecordForm(props: Props) {
  // const [typesFodder] = await Promise.all([fetchTypes()]);
  // const { fodder } = props;
  // const { data: types } = typeFodder;

  return <Form fodderList={[]} />;
}
