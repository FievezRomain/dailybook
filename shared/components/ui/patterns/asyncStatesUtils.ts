export type AsyncState = 'loading' | 'empty' | 'error' | 'success';
export function resolveAsyncState(args: { loading: boolean; error: boolean; hasData: boolean }): AsyncState {
  if (args.hasData) return 'success';
  if (args.loading) return 'loading';
  if (args.error) return 'error';
  return 'empty';
}
