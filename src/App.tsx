import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Resume from './components/Resume';
import Testimonials from './components/Testimonials';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Resume />
          <Projects />
          <Testimonials />
          <Certificates />
          <Contact />
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-black text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                © 2024 Amol Deole. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm">
                Designed by Amol Deole | Built with React, TypeScript, and Tailwind CSS
              </p>
      </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;