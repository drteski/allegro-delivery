import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ConfigAllegro } from "@/lib/types";
import Link from "next/link";

const AllegroConfig = ({ id, name, expiresIn }: ConfigAllegro) => {
  return (
    <Button variant="outline" className="cursor-pointer justify-start" asChild>
      <Link href={`/${id}`}>
        {name === "" ? "Nowe konto" : name}{" "}
        <span className="text-neutral-400 text-sm">
          (
          {expiresIn === ""
            ? " Unauthorized "
            : format(new Date(Number(expiresIn)), " dd-MM-yyyy HH:mm:ss ")}
          )
        </span>
      </Link>
    </Button>
  );
};

export default AllegroConfig;
