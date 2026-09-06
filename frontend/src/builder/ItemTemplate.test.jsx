import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ItemTemplate, toSlotRender } from './ItemTemplate';
import { Slot } from './blocks/layout';

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

  it('forwards data-aos onto the slot root', () => {
    const SlotRender = toSlotRender(cardWithHeading);
    const { container } = render(<SlotRender data-aos="fade-up" data-aos-delay="80" />);
    const root = container.firstElementChild;
    expect(root.getAttribute('data-aos')).toBe('fade-up');
    expect(root.getAttribute('data-aos-delay')).toBe('80');
  });
});

describe('Slot', () => {
  it('forwards element props directly to the Puck slot renderer', () => {
    const SlotRender = vi.fn(({ as: Comp = 'div', ...props }) => <Comp {...props}>Isi kartu</Comp>);
    render(<Slot slot={SlotRender} as="article" className="card-root" motion={{ effect: 'fade-up' }} />);
    expect(SlotRender).toHaveBeenCalled();
    expect(screen.getByText('Isi kartu').tagName).toBe('ARTICLE');
    expect(screen.getByText('Isi kartu')).toHaveClass('card-root');
    expect(screen.getByText('Isi kartu')).toHaveAttribute('data-aos', 'fade-up');
  });
});

describe('ItemTemplate', () => {
  it('keeps heading text inside a card, unlike nested Puck Render', () => {
    render(<ItemTemplate items={cardWithHeading} />);
    expect(screen.getByText('Rapat senat')).toBeInTheDocument();
  });
});
