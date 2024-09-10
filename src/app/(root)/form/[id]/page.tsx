import FormPage from "@/app/components/FormPage";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: String } }) => {
  const user = await currentUser();
  if (!user) redirect("/");
  return (
    <div>
      <FormPage id={params.id} />
    </div>
  );
};

export default page;
