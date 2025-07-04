import { Request, Response, NextFunction} from "express";

export type ErrorRequestHandler = (error:any, req: Request, res: Response, next: NextFunction) => void;
export const ErrorHandler:ErrorRequestHandler = (err:any, req:Request , res:Response )=>{

    return res.status(500).json(
        {message: err.message || err.msg || "",
        stack: ""//err.stack
        }
    )

}