"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ParamValue } from "next/dist/server/request/params";

const useAccount = (id: ParamValue) => {
  const { data, isLoading } = useQuery({
    queryKey: ["accounts", { id }],
    queryFn: async () => {
      return await axios
        .get(`/api/allegro/config/${id}`)
        .then((res) => res.data.account);
    },
  });
  return {
    account: data,
    isAccountLoading: isLoading,
  };
};

export default useAccount;
