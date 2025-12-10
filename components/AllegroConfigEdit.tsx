"use client";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ConfigAllegro } from "@/lib/types";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Data = {
  data: ConfigAllegro;
  scope: string;
};

const AllegroConfigEdit = ({ data, scope }: Data) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") ?? "";
  const [newConfig, setNewConfig] = useState<ConfigAllegro>(() => ({
    ...data,
    authorizationCode: data.authorizationCode || code || "",
  }));
  const saveData = (partial: Partial<ConfigAllegro>) => {
    setNewConfig((prevState) => ({ ...prevState, ...partial }));
  };

  const handleSave = async () => {
    try {
      console.log(newConfig);
      await axios.post(`/api/allegro/config/${data.id}`, newConfig).then(() => {
        router.refresh();
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setNewConfig((prev) => {
      localStorage.setItem(
        "account",
        JSON.stringify({
          ...prev,
          ...data,
          authorizationCode:
            data.authorizationCode || prev.authorizationCode || code || "",
        }),
      );
      return {
        ...prev,
        ...data,
        authorizationCode:
          data.authorizationCode || prev.authorizationCode || code || "",
      };
    });
    if (code) {
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      window.history.replaceState(null, "", url.toString());
    }
  }, [data, code]);
  return (
    <div className="flex flex-col gap-4 border rounded-md p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">
          {newConfig.name === "" ? "Nowe konto" : newConfig.name}
        </h2>

        {scope !== "" && (
          <>
            {newConfig.clientId !== "" &&
              newConfig.clientSecret !== "" &&
              newConfig.redirectUri !== "" && (
                <>
                  {newConfig.authorizationCode === "" ? (
                    <Button
                      className="cursor-pointer"
                      variant="secondary"
                      asChild
                    >
                      <Link
                        href={`https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${newConfig.clientId}&redirect_uri=${encodeURIComponent(newConfig.redirectUri)}&scope=${encodeURIComponent(scope)}`}
                        target="_blank"
                      >
                        Authorize
                      </Link>
                    </Button>
                  ) : newConfig.authorizationCode !== "" &&
                    newConfig.accessToken === "" ? (
                    <Button
                      className="cursor-pointer"
                      variant="secondary"
                      onClick={() => {
                        axios
                          .post("/api/allegro/auth/get", newConfig)
                          .then(() => router.refresh());
                      }}
                    >
                      Get Token
                    </Button>
                  ) : (
                    <Button
                      className="cursor-pointer"
                      variant="secondary"
                      onClick={() => {
                        axios
                          .post("/api/allegro/auth/refresh", newConfig)
                          .then(() => router.refresh());
                      }}
                    >
                      Refresh Tokens
                    </Button>
                  )}
                </>
              )}
          </>
        )}
      </div>

      <Input
        placeholder="Konto"
        value={newConfig.name}
        onChange={(e) => saveData({ name: e.target.value })}
      />
      <Input
        placeholder="Client ID"
        value={newConfig.clientId}
        onChange={(e) => saveData({ clientId: e.target.value })}
      />
      <Input
        placeholder="Client Secret"
        value={newConfig.clientSecret}
        onChange={(e) => saveData({ clientSecret: e.target.value })}
      />
      <Input
        placeholder="Redirect URL"
        value={newConfig.redirectUri}
        onChange={(e) => saveData({ redirectUri: e.target.value })}
      />
      <Input
        placeholder="Authorization Code"
        value={newConfig.authorizationCode}
        onChange={(e) => saveData({ authorizationCode: e.target.value })}
      />
      <Input
        placeholder="Access Token"
        value={newConfig.accessToken}
        onChange={(e) => saveData({ accessToken: e.target.value })}
      />
      <Input
        placeholder="Refresh Token"
        value={newConfig.refreshToken}
        onChange={(e) => saveData({ refreshToken: e.target.value })}
      />

      <span className="text-sm">
        Expires In:{" "}
        {newConfig.expiresIn
          ? format(new Date(Number(newConfig.expiresIn)), "dd-MM-yyyy HH:mm:ss")
          : " ---"}
      </span>

      <div className="flex gap-4 justify-between">
        <Button
          variant="secondary"
          className="cursor-pointer"
          onClick={() => {
            localStorage.removeItem("account");
            router.refresh();
          }}
        >
          Close
        </Button>
        <div className="flex gap-2">
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() =>
              axios.delete(`/api/allegro/config/${newConfig.id}`).then(() => {
                localStorage.removeItem("account");
                router.refresh();
              })
            }
          >
            Delete
          </Button>
          <Button className="cursor-pointer" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllegroConfigEdit;
