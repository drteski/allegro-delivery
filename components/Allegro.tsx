"use client";
import { Button } from "@/components/ui/button";
import { ConfigAllegro } from "@/lib/types";
import axios from "axios";
import AllegroScope from "@/components/AllegroScope";
import AllegroConfig from "@/components/AllegroConfig";
import useAccounts from "@/hooks/useAccounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Allegro = () => {
  const { accounts, isLoading } = useAccounts();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => await axios.post("/api/allegro/config"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Allegro Delivery</h1>
      <div className="flex flex-col gap-8">
        <AllegroScope />
        <div className="overflow-y-auto h-[calc(100dvh-248px)] min-h-96 flex flex-col gap-2">
          {isLoading ? (
            <Skeleton className="w-full h-9" />
          ) : (
            <>
              {accounts.map((account: ConfigAllegro, index: number) => (
                <AllegroConfig key={index} {...account} />
              ))}
            </>
          )}
        </div>
        {!isLoading && (
          <Button onClick={mutation.mutate}>Dodaj nowe konto</Button>
        )}
      </div>
    </div>
  );
};
export default Allegro;
