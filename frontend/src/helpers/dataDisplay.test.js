import { agendaDisplay, postDisplay, showDataField } from './dataDisplay';

describe('agendaDisplay', () => {
  it('keeps list layout and drops unknown keys', () => {
    const clean = agendaDisplay({ layout: 'cards', title: false, hack: true });
    expect(clean.layout).toBe('cards');
    expect(clean.title).toBe(false);
    expect(clean.date).toBe(true);
    expect(clean.hack).toBeUndefined();
  });

  it('falls back when layout is illegal', () => {
    expect(agendaDisplay({ layout: 'masonry; url(x)' }).layout).toBe('list');
  });
});

describe('postDisplay', () => {
  it('defaults cover off and keeps excerpt on', () => {
    expect(postDisplay().cover).toBe(false);
    expect(postDisplay().excerpt).toBe(true);
  });
});

describe('showDataField', () => {
  it('hides only explicit false flags', () => {
    expect(showDataField({ title: false }, 'title')).toBe(false);
    expect(showDataField({ title: true }, 'title')).toBe(true);
    expect(showDataField({}, 'title')).toBe(true);
  });
});
