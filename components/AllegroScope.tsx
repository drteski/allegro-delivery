import { Input } from "@/components/ui/input";
import axios from "axios";

type Data = {
  scope: string;
};

const AllegroScope = ({ scope }: Data) => {
  return (
    <Input
      placeholder="Scope"
      defaultValue={scope}
      onChange={(e) =>
        axios.post("/api/allegro/config/scope", { scope: e.target.value })
      }
    />
  );
};

export default AllegroScope;
