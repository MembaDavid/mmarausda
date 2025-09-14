import EventsPage from "@/components/events";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function EventsPageWrapper() {
  return (
    <main>
      <Header />
      <EventsPage />
      <Footer />
    </main>
  );
}
