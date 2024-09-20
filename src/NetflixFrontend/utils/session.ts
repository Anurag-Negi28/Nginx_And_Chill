import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';
import redisClient from './redisClient';
import { setSessionData, getSessionData } from './redisClient';

const SESSION_TTL = 60 * 60 * 24; // 1 day

function parseCookies(req: IncomingMessage): { [key: string]: string } {
  return cookie.parse(req.headers.cookie || '');
}

function setServerSessionCookie(res: ServerResponse, sessionId: string): void {
  const serializedCookie = cookie.serialize('session_id', sessionId, {
    httpOnly: true,
    secure: true,
    maxAge: SESSION_TTL,
    path: '/',
  });

  res.setHeader('Set-Cookie', serializedCookie);
}

async function createNewSession(res: ServerResponse, userData: object = {}): Promise<string> {
  const sessionId = uuidv4();
  const sessionData = {
    createdAt: Date.now(),
    userData,
  };
  try {
    await setSessionData(sessionId, JSON.stringify(sessionData), SESSION_TTL);
  } catch(error) {
    console.error('Error set session in Redis');
  }
  setServerSessionCookie(res, sessionId);
  return sessionId;
}

export async function getSessionId(req: IncomingMessage, res: ServerResponse): Promise<string> {
  const cookies = parseCookies(req);
  let sessionId = cookies.session_id;

  if (!sessionId) {
    console.log('sessionId was not found in client cookie, creating...');
    sessionId = await createNewSession(res);

  } else {
    try {
        console.log('sessionId was found in client cookie, getting session data...');

        const sessionData = await getSessionData(sessionId);
        if (!sessionData) {
          // Session expired or not found, create a new one
          sessionId = await createNewSession(res);
        }

    } catch(error) {
        console.error('Error get session in Redis');
    }
  }

  return sessionId;
}



