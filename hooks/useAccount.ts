"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAccount = ({ id }: { id: number }) => {
  const { data, isLoading, isError } = useQuery({
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
    isAccountError: isError,
  };
};

export default useAccount;
