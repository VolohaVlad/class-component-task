import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
    const urlObj = new URL(request.url);
    const limit = urlObj.searchParams.get('limit');
    const offset = urlObj.searchParams.get('offset');
    return HttpResponse.json(
      {
        count: 1,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
        ],
        params: { limit, offset },
      },
      { status: 200 }
    );
  }),
  http.get('https://pokeapi.co/api/v2/pokemon/1', () =>
    HttpResponse.json(
      {
        count: 1,
        results: [
          {
            abilities: [
              {
                ability: {
                  name: 'overgrow',
                },
              },
              {
                ability: {
                  name: 'chlorophyll',
                },
              },
            ],
          },
        ],
      },
      { status: 200 }
    )
  ),
];
