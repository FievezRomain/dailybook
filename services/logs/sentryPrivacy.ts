import type { ErrorEvent } from '@sentry/react-native';
import { filterLogContext } from './logContext';
import { filterLoggerEvent } from './logEvent';

/** Final JS error hook. Native crashes and transactions require separate policies. */
export function filterJavaScriptError(event: ErrorEvent): ErrorEvent {
  const cleaned = filterLoggerEvent(event, event.message ?? 'Application operation failed');
  const tags = filterLogContext(event.tags).tags;
  const data = filterLogContext(event.contexts?.additional_context).data;
  const trace = event.contexts?.trace;
  const traceId = typeof trace?.trace_id === 'string' && /^[a-f0-9]{32}$/i.test(trace.trace_id) ? trace.trace_id : undefined;
  const spanId = typeof trace?.span_id === 'string' && /^[a-f0-9]{16}$/i.test(trace.span_id) ? trace.span_id : undefined;
  const os = event.contexts?.os;
  const osName = os?.name === 'iOS' || os?.name === 'Android' ? os.name : undefined;
  const osVersion = typeof os?.version === 'string' && /^[0-9.]{1,24}$/.test(os.version) ? os.version : undefined;
  return {
    ...cleaned, type: undefined,
    user: event.user?.id ? { id: event.user.id } : undefined,
    server_name: undefined, transaction: undefined, transaction_info: undefined,
    fingerprint: undefined, threads: undefined, spans: undefined,
    tags,
    contexts: {
      additional_context: data,
      ...(osName ? { os: { name: osName, version: osVersion } } : {}),
      ...(traceId && spanId ? { trace: { trace_id: traceId, span_id: spanId } } : {}),
    },
  };
}
