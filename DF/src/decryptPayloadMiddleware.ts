import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response,NextFunction } from "express";
import { CommonService } from "./common.Service";


@Injectable()
export class DecryptPayloadMiddleware implements NestMiddleware {
  constructor( private readonly commonService: CommonService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // decrypt logic
    const dpdKey:string = req?.body?.dpdKey;
    const method:string = req?.body?.method;
    if (req?.body?.ciphertext) {
         let decryptedData:any = await this.commonService.commondecryption(dpdKey,method,req?.body,'ct242_tob001_tob002_v1');
         req.body = JSON.parse(decryptedData);
         req.body['dpdKey'] = dpdKey;
         req.body['method'] = method;
    }
    next();
  }

}