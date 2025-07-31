import { Link } from 'react-router-dom';
export const NotFoundPage = () => (
  <div className="h-[60vh] flex items-center justify-center flex-col">
    <div className="text-4xl mb-4">404</div>
    <div className="mb-8">Page not found</div>
    <Link to="/" className="text-blue-600 underline text-lg">
      To Home
    </Link>
  </div>
);
