import { Input } from "@/components/ui/input";
import axios from "axios";
import useScope from "@/hooks/useScope";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "@tanstack/react-query";

const AllegroScope = () => {
  const { scope, isLoading } = useScope();
  const mutation = useMutation({
    mutationFn: async ({ scope }: { scope: string }) =>
      await axios.post("/api/allegro/config/scope", { scope }),
  });
  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-9" />
      ) : (
        <Input
          placeholder="Scope"
          defaultValue={scope}
          onChange={(e) => mutation.mutate({ scope: e.target.value })}
        />
      )}
    </>
  );
};

export default AllegroScope;
