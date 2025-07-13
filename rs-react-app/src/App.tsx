import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import CardList from './components/CardList';
import { Component } from 'react';
import type { PokemonDetailsResponse } from './models/PokemonDetailsResponse.ts';
import type { PokemonListResponse } from './models/PokemonListResponse.ts';
import get from 'axios';
import Tooltip from './components/Tooltip.tsx';
import Pagination from './components/Pagination.tsx';

const SEARCH_TERM_KEY = 'searchTerm';

interface State {
  searchTerm: string;
  inputValue: string;
  items: { name: string; description: string }[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  count: number;
  threwError?: boolean;
}

class App extends Component<unknown, State> {
  constructor(props: unknown) {
    super(props);
    const prevTerm = window.localStorage.getItem(SEARCH_TERM_KEY) || '';
    this.state = {
      searchTerm: prevTerm,
      inputValue: prevTerm,
      items: [],
      loading: true,
      error: null,
      page: 1,
      limit: 20,
      count: 0,
    };
  }

  componentDidMount() {
    this.fetchItems(this.state.searchTerm, this.state.page);
  }

  fetchItems = async (term: string, page: number = 1) => {
    this.setState({ loading: true });

    try {
      const searchTerm = term.trim();
      if (searchTerm) {
        await this.fetchWithTerm(term);
      } else {
        await this.fetchList(page);
      }
    } catch {
      this.setState({
        items: [],
        loading: false,
        error: 'Fail to fetch data',
        count: 0,
      });
    }
  };

  fetchWithTerm = async (term: string) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${term}`;
    try {
      const { data } = await get<PokemonDetailsResponse>(url);
      this.setState({
        items: [
          {
            name: data.name,
            description: `Abilities: ${data.abilities.map((p) => p.ability.name).join(', ')}`,
          },
        ],
        loading: false,
        error: null,
        page: 1,
        count: 1,
      });
    } catch {
      this.setState({
        loading: false,
        error: 'Pokemon not found',
        items: [],
        count: 0,
      });
    }
  };

  fetchList = async (page: number) => {
    const { limit } = this.state;
    const offset = (page - 1) * limit;

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    try {
      const listResponse = await get<PokemonListResponse>(url);

      const { results, count } = listResponse.data;

      const detailsResults = await Promise.allSettled(
        results.map(({ name, url }) =>
          get<PokemonDetailsResponse>(url).then((d) => ({
            name,
            description: `Abilities: ${d.data.abilities.map((a) => a.ability.name).join(', ')}`,
          }))
        )
      );

      const items = detailsResults.map((res) => {
        if (res.status === 'fulfilled') {
          return res.value;
        }

        return { name: 'unknown', description: 'Failed to load description' };
      });

      this.setState({
        items,
        loading: false,
        error: null,
        count,
        page,
      });
    } catch {
      this.setState({
        loading: false,
        error: 'Failed to load list',
        items: [],
        count: 0,
      });
    }
  };

  handleInputChange = (value: string) => {
    this.setState({ inputValue: value });
  };

  handleSearch = () => {
    const cleaned = this.state.inputValue.trim();
    if (cleaned === '') {
      this.setState({ searchTerm: '', page: 1 }, () => this.fetchList(1));
      window.localStorage.removeItem(SEARCH_TERM_KEY);
    } else {
      window.localStorage.setItem(SEARCH_TERM_KEY, cleaned);
      this.setState({ searchTerm: cleaned, page: 1 }, () => {
        this.fetchItems(cleaned, 1);
      });
    }
  };

  handlePrevPage = () => {
    if (this.state.page > 1) {
      this.setState(
        (prev) => ({ page: prev.page - 1 }),
        () => this.fetchItems(this.state.searchTerm, this.state.page)
      );
    }
  };

  handleNextPage = () => {
    const maxPage = Math.ceil(this.state.count / this.state.limit);
    if (this.state.page < maxPage) {
      this.setState(
        (prev) => ({ page: prev.page + 1 }),
        () => this.fetchItems(this.state.searchTerm, this.state.page)
      );
    }
  };

  throwError = () => {
    this.setState({ threwError: true });
  };

  render() {
    if (this.state.threwError) {
      throw new Error('Simulated error');
    }

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <div className="w-full max-w-xl">
          <div className="mb-6 bg-white shadow rounded p-4 flex justify-between items-center">
            <SearchBar
              value={this.state.inputValue}
              onChange={this.handleInputChange}
              onSearch={this.handleSearch}
            />
            <Tooltip text="The search is performed by a complete match of the Pokemon name">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-gray-400"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <text
                  x="10"
                  y="15"
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                >
                  ?
                </text>
              </svg>
            </Tooltip>
          </div>

          <div className="bg-white shadow rounded p-4 min-h-[300px]">
            {this.state.loading ? (
              <Loader />
            ) : this.state.error ? (
              <div className="text-red-500">{this.state.error}</div>
            ) : (
              <>
                <CardList items={this.state.items} />
                {!this.state.searchTerm && (
                  <Pagination
                    page={this.state.page}
                    total={Math.max(
                      1,
                      Math.ceil(this.state.count / this.state.limit)
                    )}
                    onPrev={this.handlePrevPage}
                    onNext={this.handleNextPage}
                  />
                )}
              </>
            )}

            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-5"
              onClick={this.throwError}
              type="button"
            >
              Error Button
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
