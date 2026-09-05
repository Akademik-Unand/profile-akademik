import { render, screen } from '@testing-library/react';
import { ItemTemplate, toSlotRender } from './ItemTemplate';

const cardWithHeading = [
  {
    type: 'Card',
    props: {
      id: 'card-1',
      content: [{ type: 'Heading', props: { id: 'h-1', title: 'Rapat senat', bind: '' } }],
    },
  },
];

describe('toSlotRender', () => {
  it('turns a typed slot array into a render function', () => {
    expect(typeof toSlotRender(cardWithHeading)).toBe('function');
    expect(toSlotRender([])).toBeUndefined();
  });
});

describe('ItemTemplate', () => {
  it('keeps heading text inside a card, unlike nested Puck Render', () => {
    render(<ItemTemplate items={cardWithHeading} />);
    expect(screen.getByText('Rapat senat')).toBeInTheDocument();
  });
});
