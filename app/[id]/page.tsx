"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ConfigPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["config"],
    queryFn: () => {},
  });
  // <AllegroConfigEdit data={config} scope={scope} />
  return <div>{isLoading ? "dupa" : id}</div>;
};

export default ConfigPage;
