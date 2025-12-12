"use client";
import { useParams } from "next/navigation";
import AllegroConfigEdit from "@/components/AllegroConfigEdit";

const ConfigPage = () => {
  const { id } = useParams();
  if (typeof window !== "undefined") {
    localStorage.setItem("accountId", String(id));
  }
  return <AllegroConfigEdit id={id} />;
};

export default ConfigPage;
