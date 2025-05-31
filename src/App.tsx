import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyComponent } from './components/common/LazyComponent';
import { routes } from './routes/routes';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <LazyComponent>
                  <Component />
                </LazyComponent>
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
        
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
    </ThemeProvider>
  );
}

export default App;