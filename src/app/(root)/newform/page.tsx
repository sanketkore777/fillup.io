import CreatorForm from "@/app/components/CreatorForm";

const page = async () => {
  return (
    <div className="mainclass p-4 bg-gray-100 min-h-[92vh] overflow-auto   flex flex-col justify-center items-center text-gray-900 ">
      <h1 className="text-4xl font-semibold">Custmizable Form</h1>
      <CreatorForm />
    </div>
  );
};

export default page;
