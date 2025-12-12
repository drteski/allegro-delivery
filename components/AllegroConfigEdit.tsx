"use client";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ConfigAllegro } from "@/lib/types";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { ParamValue } from "next/dist/server/request/params";
import useAccount from "@/hooks/useAccount";
import useScope from "@/hooks/useScope";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AllegroConfigEdit = ({ id }: { id: ParamValue }) => {
  const { account, isAccountLoading } = useAccount(id);
  const [info, setInfo] = useState<string>("");
  const { scope } = useScope();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newAccount, setNewConfig] = useState<ConfigAllegro | object>({});

  const handleSave = useMutation({
    mutationFn: async () =>
      await axios.post(`/api/allegro/config/${id}`, { ...newAccount }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
  const handleDelete = useMutation({
    mutationFn: async () =>
      await axios.delete(`/api/allegro/config/${account.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      localStorage.removeItem("accountId");
      router.push("/");
    },
  });

  const handleGetTokens = useMutation({
    mutationFn: async () =>
      await axios
        .post("/api/allegro/auth/get", { ...account, ...newAccount })
        .then((res) => res.data),
    onSuccess: (value) => {
      console.log(value);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setInfo(value);
    },
  });

  const handleRefreshTokens = useMutation({
    mutationFn: async () =>
      await axios
        .post("/api/allegro/auth/refresh", {
          ...account,
          ...newAccount,
        })
        .then((res) => res.data),
    onSuccess: (value) => {
      console.log(value);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setInfo(value);
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const code = localStorage.getItem("authorizationCode") ?? "";
      if (code !== "") {
        setNewConfig((prev) => ({
          ...prev,
          authorizationCode: code,
        }));
        localStorage.removeItem("authorizationCode");
      }
    }
  }, []);
  return (
    <div className="flex flex-col gap-4 max-w-[800px]">
      {isAccountLoading ? (
        <Skeleton className="h-9" />
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium flex h-9">
            {account.name === "" ? "Nowe konto" : account.name}
          </h2>

          {scope !== "" && (
            <>
              {account.clientId !== "" &&
                account.clientSecret !== "" &&
                account.redirectUri !== "" && (
                  <>
                    {account.authorizationCode === "" ? (
                      <Button
                        className="cursor-pointer"
                        variant="secondary"
                        onClick={() =>
                          router.push(
                            `https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${account.clientId}&redirect_uri=${encodeURIComponent(account.redirectUri)}&scope=${encodeURIComponent(scope)}`,
                          )
                        }
                      >
                        Authorize
                      </Button>
                    ) : account.authorizationCode !== "" &&
                      account.accessToken === "" ? (
                      <Button
                        className="cursor-pointer"
                        variant="secondary"
                        onClick={() => handleGetTokens.mutate()}
                      >
                        Get Token
                      </Button>
                    ) : (
                      <Button
                        className="cursor-pointer"
                        variant="secondary"
                        onClick={() => handleRefreshTokens.mutate()}
                      >
                        Refresh Tokens
                      </Button>
                    )}
                  </>
                )}
            </>
          )}
        </div>
      )}
      {isAccountLoading ? (
        <Skeleton className="h-[384px]" />
      ) : (
        <>
          <Input
            placeholder="Konto"
            defaultValue={account.name}
            onChange={(e) =>
              setNewConfig((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            placeholder="Client ID"
            defaultValue={account.clientId}
            onChange={(e) =>
              setNewConfig((prev) => ({ ...prev, clientId: e.target.value }))
            }
          />
          <Input
            placeholder="Client Secret"
            defaultValue={account.clientSecret}
            onChange={(e) =>
              setNewConfig((prev) => ({
                ...prev,
                clientSecret: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Redirect URL"
            defaultValue={account.redirectUri}
            onChange={(e) =>
              setNewConfig((prev) => ({ ...prev, redirectUri: e.target.value }))
            }
          />
          <Input
            placeholder="Authorization Code"
            defaultValue={account.authorizationCode}
            onChange={(e) =>
              setNewConfig((prev) => ({
                ...prev,
                authorizationCode: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Access Token"
            defaultValue={account.accessToken}
            onChange={(e) =>
              setNewConfig((prev) => ({ ...prev, accessToken: e.target.value }))
            }
          />
          <Input
            placeholder="Refresh Token"
            defaultValue={account.refreshToken}
            onChange={(e) =>
              setNewConfig((prev) => ({
                ...prev,
                refreshToken: e.target.value,
              }))
            }
          />
          <span className="text-sm">
            Expires In:{" "}
            {account.expiresIn
              ? format(
                  new Date(Number(account.expiresIn)),
                  "dd-MM-yyyy HH:mm:ss",
                )
              : " ---"}
          </span>
        </>
      )}
      {isAccountLoading ? (
        <Skeleton className="h-9" />
      ) : (
        <div className="flex gap-4 justify-between">
          <Button variant="secondary" className="cursor-pointer" asChild>
            <Link
              href={"/"}
              onClick={() => localStorage.removeItem("accountId")}
            >
              Close
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => handleDelete.mutate()}
            >
              Delete
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => handleSave.mutate()}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllegroConfigEdit;
