import winston from 'winston';
import TransportStream from 'winston-transport';
import { FORBIDDEN_ACCESS, AUTH_ERRORS } from '../config/errors';
import { ENTITY_TYPE_ACTIVITY } from '../schema/internalObject';

function printTermMsg(msg: any, title = 'msg', lableColor: string = 'red'): void {
  const lableColorMap: Record<string, string> = {
    red: '\x1b[31m',
    blk: '\x1b[30m',
    grn: '\x1b[32m',
    ylw: '\x1b[33m',
    blu: '\x1b[34m',
    mag: '\x1b[35m',
    cyn: '\x1b[36m',
    whi: '\x1b[37m',
    'brt-blk': '\x1b[90m', // Gray
    'brt-red': '\x1b[91m',
    'brt-grn': '\x1b[92m',
    'brt-ylw': '\x1b[93m',
    'brt-blu': '\x1b[94m',
    'brt-mag': '\x1b[95m',
    'brt-cyn': '\x1b[96m',
    'brt-whi': '\x1b[97m',
    clr: '\x1b[0m',
  };

  const color = lableColorMap[lableColor] || lableColorMap['red'];
  const reset = lableColorMap['clr'];

  let formattedMsg = msg;
  if (typeof msg === 'object' && msg !== null) {
    try {
      formattedMsg = JSON.stringify(msg, null, 2);
    } catch {
      // Fallback in case of massive circular objects that cannot be stringified
      formattedMsg = '[Circular or Complex Object] ' + Object.keys(msg).join(', ');
    }
  }
  console.log(`${color}*** [${title.toUpperCase()}] ***${reset}: ${formattedMsg}`);
}

const isValidError = (errCode: string, httpStatus: any) => {
  let isValid = true;
  if (AUTH_ERRORS.includes(errCode) || errCode === FORBIDDEN_ACCESS) {
    isValid = false;
  }
  return isValid;
};

// TODO create a function that handels writing to the DB
const errorPayload = (userContext: any, errorContext: any) => {
  const timestamp = new Date().toISOString();
  const timestampMs = Date.now();
  const payloadId = `${timestampMs}-0`;
  const errCode = errorContext?.extensions?.code || 'UNKNOWN';
  const errName = errorContext?.status_type || errorContext?.extensions?.code || 'UNKNOWN';
  const httpStatus = errorContext?.extensions?.http_status || 'NA';
  const errMsg = `[${errCode}] MSG: ${errorContext?.message} HTTP: ${httpStatus}`;
  const rawErrData = JSON.stringify(errorContext);
  const contextData = {
    message: errMsg,
  };

  const errData = {
    name: errName,
    code: errCode,
    message: errMsg,
    raw_data: rawErrData,
  };

  const payload = {
    internal_id: payloadId,
    id: payloadId,
    timestamp: timestamp,
    entity_type: ENTITY_TYPE_ACTIVITY,
    event_type: errCode.toLowerCase() || 'user_action_error',
    event_scope: 'error',
    event_status: 'error',
    error_data: errData,
    user_id: userContext.id,
    context_data: contextData,
  };
  return payload;
};

export const logUserActionErrorsToHistory = (error: any, user: any) => {
  printTermMsg('start-err-log', 'ERR-LOG', 'grn');
  setImmediate(async () => {
    const rawErr = error;
    const errCode = rawErr?.extensions?.code;
    const httpStatus = rawErr?.extensions?.http_status;
    printTermMsg(error, 'RAW ERR', 'cyn');
    // printTermMsg(user, 'RAW USR', 'cyn');

    if (!isValidError(errCode, httpStatus)) {
      return;
    }

    if (error.category === 'DATABASE_ERROR' || error.message?.includes('opencti_history')) {
      return;
    }

    printTermMsg('is valid', 'ERR-LOG', 'grn');
    const userContext = user;

    try {
      printTermMsg('start-db', 'ERR-LOG', 'grn');
      const { elIndex } = await import('../database/engine.js');
      const { INDEX_HISTORY } = await import('../database/utils');
      const errorHistoryPayload = errorPayload(userContext, rawErr);

      printTermMsg(errorHistoryPayload, 'PAYLOAD', 'cyn');
      printTermMsg('sending to DB', 'ERR-LOG', 'ylw');
      await elIndex(INDEX_HISTORY, errorHistoryPayload);
    } catch (e) {
      printTermMsg(e, 'CUSTOM TRANSPORT CRASH', 'red');
      process.stderr.write('[ErrorHistoryTransport Fail] ${String(dbWriteFail.message)}\n');
    }
  });
};
