"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Config } from "@/lib/types";
import axios from "axios";
import AllegroScope from "@/components/AllegroScope";
import AllegroConfig from "@/components/AllegroConfig";
import { useRouter } from "next/navigation";

const Allegro = () => {
  const router = useRouter();
  const [config, setConfig] = useState<Config>({ scope: "", accounts: [] });
  useEffect(() => {
    const getConfigs = async () => {
      await axios.get("/api/allegro/config").then((res) => {
        setConfig(res.data);
      });
    };
    getConfigs();
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Allegro</h1>
      <div className="flex flex-col gap-8">
        <AllegroScope scope={config.scope} />
        <div className="overflow-y-auto h-[calc(100dvh-248px)] min-h-96 flex flex-col gap-8">
          {config.accounts.map((item, index) => (
            <AllegroConfig key={index} id={item.id} scope={config.scope} />
          ))}
        </div>
        <Button
          onClick={() => {
            axios
              .post(`/api/allegro/config/${config.accounts.length + 1}`, {
                id: config.accounts.length + 1,
                name: "",
                clientId: "",
                clientSecret: "",
                redirectUri: "",
                authorizationCode: "",
                accessToken: "",
                refreshToken: "",
                expiresIn: "",
              })
              .then(() => router.refresh());
          }}
        >
          Dodaj nowe konto
        </Button>
      </div>
    </div>
  );
};
export default Allegro;
