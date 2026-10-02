import type { Event, StackFrame } from '@sentry/react-native';

const errorTypes = new Set(['Error', 'TypeError', 'ReferenceError', 'RangeError', 'SyntaxError', 'URIError', 'EvalError', 'AggregateError', 'AxiosError', 'FirebaseError']);
const labels = new Set([
  'Note form submit failed', 'Animal form submit failed', 'Event form submit failed',
  'Contact form submit failed', 'Wish form submit failed', 'Group form submit failed',
  'Group wizard submit failed', 'Voice recorder cleanup failed',
]);
const breadcrumbCategories = new Set(['animals', 'events', 'notes', 'contacts', 'wishes', 'groups', 'auth']);
const breadcrumbActions = new Set(['create_started', 'create_succeeded', 'create_failed', 'update_started', 'update_succeeded', 'update_failed', 'delete_started', 'delete_succeeded', 'delete_failed', 'upload_started', 'upload_failed']);

export function technicalBreadcrumb(category: string, message: string): { category: string; message: string } {
  return {
    category: breadcrumbCategories.has(category) ? category : 'application',
    message: breadcrumbActions.has(message) ? message : 'application_action',
  };
}

export function technicalLogLabel(message: string): string {
  return labels.has(message) ? message : 'Application operation failed';
}

function technicalFrame(frame: StackFrame): StackFrame {
  // Keep code locations for symbolication, never frame locals/source excerpts.
  const location = (value?: string) => value?.split(/[?#]/, 1)[0].replace(/(https?:\/\/)[^/]*@/i, '$1');
  return {
    filename: location(frame.filename), abs_path: location(frame.abs_path),
    function: frame.function, module: frame.module, platform: frame.platform,
    lineno: frame.lineno, colno: frame.colno, in_app: frame.in_app,
    instruction_addr: frame.instruction_addr, addr_mode: frame.addr_mode, debug_id: frame.debug_id,
  };
}

/** Scope processor for explicit LoggerService events, not a global SDK scrubber. */
export function filterLoggerEvent(event: Event, message: string): Event {
  return {
    ...event,
    message: technicalLogLabel(message),
    logentry: undefined, request: undefined, extra: undefined, breadcrumbs: undefined,
    exception: event.exception ? { values: event.exception.values?.map(exception => ({
      type: errorTypes.has(exception.type ?? '') ? exception.type : 'Error',
      value: technicalLogLabel(message),
      mechanism: exception.mechanism ? { type: exception.mechanism.type, handled: exception.mechanism.handled } : undefined,
      stacktrace: exception.stacktrace ? { frames: exception.stacktrace.frames?.map(technicalFrame) } : undefined,
    })) } : undefined,
  };
}
