import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AboutPage } from './pages/AboutPage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFound';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<SearchPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/:page" element={<SearchPage />} />
      <Route path="/:page/:detailsId" element={<SearchPage />} />
      <Route path="not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
