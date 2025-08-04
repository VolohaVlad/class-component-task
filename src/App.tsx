import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AboutPage } from './pages/AboutPage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFound';
import { ThemeToggle } from './components/ThemeToggle';

export const App = () => (
  <>
    <header className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <ThemeToggle />
    </header>
    <BrowserRouter basename="class-component-task">
      <Routes>
        <Route path="/" element={<SearchPage />}>
          <Route index element={null} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </>
);
