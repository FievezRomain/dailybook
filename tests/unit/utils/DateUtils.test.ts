import instanceDateUtils from '../../../shared/utils/DateUtils';

describe('DateUtils.dateFormatter', () => {
  it('converts dd/MM/yyyy to yyyy-mm-dd', () => {
    expect(instanceDateUtils.dateFormatter('25/12/2024', 'dd/MM/yyyy', '/')).toBe('2024-12-25');
  });

  it('converts yyyy-mm-dd to dd/MM/yyyy', () => {
    expect(instanceDateUtils.dateFormatter('2024-12-25', 'yyyy-mm-dd', '-')).toBe('25/12/2024');
  });

  it('returns undefined for unknown format', () => {
    expect(instanceDateUtils.dateFormatter('2024-12-25', 'unknown', '-')).toBeUndefined();
  });
});

describe('DateUtils.isDateValid', () => {
  it('returns true for a valid date string', () => {
    expect(instanceDateUtils.isDateValid('2024-01-15')).toBe(true);
  });

  it('returns false for an invalid date string', () => {
    expect(instanceDateUtils.isDateValid('not-a-date')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(instanceDateUtils.isDateValid('')).toBe(false);
  });
});

describe('DateUtils.transformTimestampToDate', () => {
  it('returns a formatted date string from a timestamp', () => {
    // Use a fixed timestamp: 2024-01-15T10:30:00.000Z
    const ts = new Date('2024-01-15T10:30:00.000Z').getTime();
    const result = instanceDateUtils.transformTimestampToDate(ts);
    // Result is locale-formatted — just verify it is a non-empty string
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the year from the timestamp', () => {
    const ts = new Date('2024-01-15T10:30:00.000Z').getTime();
    const result = instanceDateUtils.transformTimestampToDate(ts);
    expect(result).toContain('2024');
  });
});
