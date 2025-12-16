import Header from './components/Header';
import Hero from './components/Hero';
import Programs from './components/Programs';
import Workouts from './components/Workouts';
import DietPlans from './components/DietPlans';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Programs />
      <Workouts />
      <DietPlans />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
