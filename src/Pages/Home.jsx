import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import HowItWorks from '../Components/HowItWorks';
import Benefits from '../Components/Benefits';
import ShopBanner from '../Components/ShopBanner';
import Testimonials from '../Components/Testimonials';
import Support from '../Components/Support';
import Footer from '../Components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <ShopBanner />
        <Testimonials />
        <Support />
      </main>
      <Footer />
    </div>
  );
};

export default Home; 