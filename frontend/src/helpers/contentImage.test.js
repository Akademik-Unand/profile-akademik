import { imageClass, parseImageClass } from './contentImage';

describe('imageClass', () => {
  it('builds size and align classes', () => {
    expect(imageClass({ size: 'sm', align: 'left' })).toBe('content-img content-img-sm content-img-left');
  });

  it('falls back to medium centered', () => {
    expect(imageClass({})).toBe('content-img content-img-md content-img-center');
    expect(imageClass({ size: 'huge', align: 'top' })).toBe('content-img content-img-md content-img-center');
  });
});

describe('parseImageClass', () => {
  it('reads size and align from the class string', () => {
    expect(parseImageClass('content-img content-img-lg content-img-right')).toEqual({ size: 'lg', align: 'right' });
  });
});
