import { Link } from 'react-router-dom';
export const AboutPage = () => (
  <div className="max-w-xl mx-auto my-12 bg-white shadow-md border rounded-md p-5">
    <h1 className="text-2xl font-bold mb-2">About</h1>
    <p className="mb-4">
      Pokemon search application created by Uladzislau Valakhanovich.
    </p>
    <p className="mb-4">Version: 1.0.0</p>
    <a
      href="https://rs.school/react/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline mb-2 block"
    >
      RS School React Course
    </a>
    <Link to="/" className="text-gray-600 hover:underline">
      Back to Home page
    </Link>
  </div>
);
