import Hero from "@/components/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { supabaseServer } from "@/utils/supabase/server";

export default function Landing() {
  return (
    <div>
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
