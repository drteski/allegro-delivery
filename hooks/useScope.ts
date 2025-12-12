"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useScope = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["scope"],
    queryFn: async () => {
      return await axios
        .get(`/api/allegro/config/scope/`)
        .then((res) => res.data.scope);
    },
  });
  return { scope: data, isLoading, isError };
};

export default useScope;
