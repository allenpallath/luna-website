import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SniffRadar from './components/SniffRadar';
import DoorPeekShowcase from './components/DoorPeekShowcase';
import VacuumCleaner from './components/VacuumCleaner';
import DeliveryGuyAlert from './components/DeliveryGuyAlert';
import LunaDossier from './components/LunaDossier';
import TreatPhysics from './components/TreatPhysics';
import PhotoGallery from './components/PhotoGallery';
import Footer from './components/Footer';
import LunaCursor from './shared/LunaCursor';
import CoatParallaxBackground from './shared/CoatParallaxBackground';

export default function App() {
  return (
    <div className="luna-cursor-enabled isolate min-h-screen bg-white text-zinc-950 selection:bg-zinc-900 selection:text-white font-sans relative antialiased overflow-x-hidden">
      <CoatParallaxBackground />
      {/* Navigation Header */}
      <Navbar />

      {/* Flagship content follows a consistent section flow below the hero. */}
      <main className="relative z-10 w-full overflow-x-hidden">
        <HeroSection />
        <SniffRadar />
        <DoorPeekShowcase />
        <VacuumCleaner />
        <DeliveryGuyAlert />
        <LunaDossier />
        <TreatPhysics />
        <PhotoGallery />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
      <LunaCursor />
    </div>
  );
}
