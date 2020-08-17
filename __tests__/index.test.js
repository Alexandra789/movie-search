import Card from '../src/Card';

test('card.Title should be Hello World', () => {
  expect(new Card({ Title: 'Hello World' })).toEqual(
    {
      id: undefined, poster: undefined, rating: undefined, title: 'Hello World', year: undefined,
    },
  );
});

test('card year should be 2020', () => {
  expect(new Card({ Year: 2020 })).toEqual(
    {
      id: undefined, poster: undefined, rating: undefined, title: undefined, year: 2020,
    },
  );
});
