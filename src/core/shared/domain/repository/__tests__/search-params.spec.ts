import { SearchParams } from '../search-params';

describe('SearchParams Unit Tests', () => {
  describe('page prop', () => {
    it('should set default page to 1', () => {
      const params = new SearchParams();
      expect(params.page).toBe(1);
    });

    test.each([
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 'fake', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ])('should set page as $expected when input is $page', ({ page, expected }) => {
      expect(new SearchParams({ page: page as any }).page).toBe(expected);
    });
  });

  describe('per_page prop', () => {
    it('should set default per_page to 15', () => {
      const params = new SearchParams();
      expect(params.per_page).toBe(15);
    });

    test.each([
      { per_page: null, expected: 15 },
      { per_page: undefined, expected: 15 },
      { per_page: '', expected: 15 },
      { per_page: 'fake', expected: 15 },
      { per_page: 0, expected: 15 },
      { per_page: -1, expected: 15 },
      { per_page: 5.5, expected: 15 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },
      { per_page: {}, expected: 15 },
      { per_page: 1, expected: 1 },
      { per_page: 2, expected: 2 },
      { per_page: 10, expected: 10 },
    ])('should set per_page as $expected when input is $per_page', ({ per_page, expected }) => {
      expect(new SearchParams({ per_page: per_page as any }).per_page).toBe(expected);
    });
  });

  describe('sort prop', () => {
    it('should set default sort to null', () => {
      const params = new SearchParams();
      expect(params.sort).toBeNull();
    });

    test.each([
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 5.5, expected: '5.5' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
      { sort: 'field', expected: 'field' },
    ])('should set sort as $expected when input is $sort', ({ sort, expected }) => {
      expect(new SearchParams({ sort: sort as any }).sort).toBe(expected);
    });
  });

  describe('sort_dir prop', () => {
    it('should set sort_dir to null when sort is missing or falsy', () => {
      let params = new SearchParams();
      expect(params.sort_dir).toBeNull();

      params = new SearchParams({ sort: null });
      expect(params.sort_dir).toBeNull();

      params = new SearchParams({ sort: undefined });
      expect(params.sort_dir).toBeNull();

      params = new SearchParams({ sort: '' });
      expect(params.sort_dir).toBeNull();
    });

    test.each([
      { sort_dir: null, expected: 'asc' },
      { sort_dir: undefined, expected: 'asc' },
      { sort_dir: '', expected: 'asc' },
      { sort_dir: 0, expected: 'asc' },
      { sort_dir: 'fake', expected: 'asc' },
      { sort_dir: 'asc', expected: 'asc' },
      { sort_dir: 'ASC', expected: 'asc' },
      { sort_dir: 'desc', expected: 'desc' },
      { sort_dir: 'DESC', expected: 'desc' },
    ])('should set sort_dir as $expected when input is $sort_dir', ({ sort_dir, expected }) => {
      expect(
        new SearchParams({ sort: 'field', sort_dir: sort_dir as any }).sort_dir,
      ).toBe(expected);
    });
  });

  describe('filter prop', () => {
    it('should set default filter to null', () => {
      const params = new SearchParams();
      expect(params.filter).toBeNull();
    });

    test.each([
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: null },
      { filter: 0, expected: '0' },
      { filter: -1, expected: '-1' },
      { filter: 5.5, expected: '5.5' },
      { filter: true, expected: 'true' },
      { filter: false, expected: 'false' },
      { filter: {}, expected: '[object Object]' },
      { filter: 'field', expected: 'field' },
    ])('should set filter as $expected when input is $filter', ({ filter, expected }) => {
      expect(new SearchParams({ filter: filter as any }).filter).toBe(expected);
    });
  });
});