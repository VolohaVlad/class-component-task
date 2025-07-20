import { type ChangeEvent, Component, type KeyboardEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

class SearchBar extends Component<SearchBarProps> {
  handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value);
  };

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.props.onSearch();
    }
  };

  render() {
    return (
      <div className="flex gap-2 items-center">
        <input
          className="border px-4 py-2 rounded w-64"
          type="text"
          value={this.props.value}
          onChange={this.handleInput}
          onKeyDown={this.handleKeyDown}
          placeholder="Search Pokemon..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={this.props.onSearch}
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;
