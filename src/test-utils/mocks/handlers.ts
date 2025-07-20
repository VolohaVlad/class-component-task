import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', () =>
    HttpResponse.json(
      {
        count: 1,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
        ],
      },
      { status: 200 }
    )
  ),
];
