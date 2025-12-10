"use client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ConfigAllegro } from "@/lib/types";
import axios from "axios";
import AllegroConfigEdit from "@/components/AllegroConfigEdit";
import { useRouter } from "next/navigation";

type Data = {
  id: number;
  scope: string;
};
const AllegroConfig = ({ id, scope }: Data) => {
  const router = useRouter();
  const [config, setConfig] = useState<ConfigAllegro>({
    id,
    name: "",
    clientId: "",
    clientSecret: "",
    redirectUri: "",
    authorizationCode: "",
    accessToken: "",
    refreshToken: "",
    expiresIn: "",
  });
  const localStorageAccount =
    localStorage.getItem("account") !== null
      ? JSON.parse(localStorage.getItem("account") as string)
      : "";

  useEffect(() => {
    const getConfig = async () => {
      await axios
        .get(`/api/allegro/config/${id}`)
        .then((res) => setConfig(res.data.account));
    };
    getConfig();
  }, [id]);
  return (
    <>
      {parseInt(localStorageAccount.id, 10) === id ? (
        <AllegroConfigEdit data={config} scope={scope} />
      ) : (
        <Button
          onClick={() => {
            localStorage.setItem("account", JSON.stringify(config));
            router.refresh();
          }}
          variant="outline"
          className="cursor-pointer justify-start"
        >
          {config.name === "" ? "Nowe konto" : config.name}{" "}
          <span className="text-neutral-400 text-sm">
            (
            {config.expiresIn === ""
              ? "Nie autoryzowane"
              : format(
                  new Date(Number(config.expiresIn)),
                  "dd-MM-yyyy HH:mm:ss",
                )}
            )
          </span>
        </Button>
      )}
    </>
  );
};

export default AllegroConfig;
