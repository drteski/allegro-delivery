"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAccounts = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      return await axios
        .get(`/api/allegro/config/`)
        .then((res) => res.data.accounts);
    },
  });
  return { accounts: data, isLoading, isError };
};

export default useAccounts;
