import {ReqUser} from "../../src/models/Interfaces";

declare global{
    namespace Express {
        interface Request {
            user: ReqUser
        }
    }
}