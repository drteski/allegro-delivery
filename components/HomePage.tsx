"use client";

import AllegroOrderInfo from "@/components/AllegroOrderInfo";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const HomePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const code = searchParams.get("code");

  const mutation = useMutation({
    mutationFn: async ({
      id,
      authorizationCode,
    }: {
      id: string;
      authorizationCode: string;
    }) => {
      await axios.post(`/api/allegro/config/${id}`, { authorizationCode });
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      router.push(`/${id}`);
    },
  });

  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    if (!code) return;
    if (handledRef.current === code) return;
    handledRef.current = code;

    localStorage.setItem("authorizationCode", code);

    const accountId = localStorage.getItem("accountId") ?? "";
    if (!accountId) return;

    mutation.mutate({ id: accountId, authorizationCode: code });
  }, [code, mutation]);

  return <AllegroOrderInfo />;
};

export default HomePage;
