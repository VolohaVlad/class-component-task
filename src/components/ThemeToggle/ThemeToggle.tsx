import { useTheme } from '../../hooks/UseTheme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-row gap-2">
      <label className="flex flex-row items-center space-x-2 cursor-pointer">
        <input
          className="peer hidden"
          type="radio"
          checked={theme === 'light'}
          onChange={() => setTheme('light')}
        />
        <div className="w-4 h-4 rounded-full border border-gray-400 peer-checked:bg-blue-500 transition"></div>
        Light
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          className="peer hidden"
          checked={theme === 'dark'}
          onChange={() => setTheme('dark')}
        />
        <div className="w-4 h-4 rounded-full border border-gray-400 peer-checked:bg-blue-500 transition"></div>
        Dark
      </label>
    </div>
  );
};
