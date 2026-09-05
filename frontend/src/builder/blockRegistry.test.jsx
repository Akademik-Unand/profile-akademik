import { render, screen } from '@testing-library/react';
import { registerBlockRenders, renderSlotItems } from './blockRegistry';
import { Slot } from './blocks/layout';

function TitleBlock({ title }) {
  return <p>{title}</p>;
}

registerBlockRenders({ Heading: TitleBlock, AgendaArchive: TitleBlock });

describe('renderSlotItems', () => {
  it('renders a data block nested inside a card slot array', () => {
    render(
      <Slot
        slot={[{ type: 'AgendaArchive', props: { id: 'ag-1', title: 'Daftar agenda' } }]}
        className="card"
      />,
    );
    expect(screen.getByText('Daftar agenda')).toBeInTheDocument();
  });

  it('skips unknown types', () => {
    expect(renderSlotItems([{ type: 'Unknown', props: {} }])).toEqual([null]);
  });
});
