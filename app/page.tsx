import Allegro from "@/components/Allegro";
import AllegroOrderInfo from "@/components/AllegroOrderInfo";

export default function Home() {
  return (
    <div className="grid grid-cols-[500px_1fr] p-8 gap-8">
      <Allegro />
      <div className="mt-12 border rounded-md p-4">
        <AllegroOrderInfo />
      </div>
    </div>
  );
}
