//import { Injectable, NestMiddleware } from "@nestjs/common";
//import { Request, Response,NextFunction } from "express";
import { CommonService } from "./common.Service";
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin'; 

const DecryptPayloadMiddleware = (commonService: CommonService): FastifyPluginAsync => {
  const plugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.addHook('preHandler', async (req: any, res) => {
      
      if (!req.body) {
        return; 
      }

      const { dpdKey, method, ciphertext } = req.body;
      console.log("dpdKey", dpdKey);
      console.log("method", method);

      if (ciphertext) {
        try {
          let decryptedData: any = await commonService.commondecryption(dpdKey, method, req.body, 'ct003_ag001_oprmatrix_v1');
          decryptedData = decryptedData.replace(/[\x00-\x1F\x7F]+/g, '').trim();

         
          const parsedData = JSON.parse(decryptedData);
          
          req.body = {
            ...parsedData,
            dpdKey,
            method,
          };
        } catch (error) {
          console.error("Decryption or JSON parse failed:", error);
          
          res.code(400).send({ message: "Invalid payload" });
        }
      }
    });
  };
  return fp(plugin);
};

export default DecryptPayloadMiddleware;
