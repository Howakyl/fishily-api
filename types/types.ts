import { Request } from "express";
import {User} from '../models/User';
import { Session, SessionData } from "express-session";

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { currentUser?: User };
  };
};
