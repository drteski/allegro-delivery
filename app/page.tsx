import { Suspense } from "react";
import HomePage from "@/components/HomePage";

const Home = () => {
  return (
    <Suspense fallback={<div />}>
      <HomePage />
    </Suspense>
  );
};

export default Home;
