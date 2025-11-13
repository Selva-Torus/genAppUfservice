import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { NotAcceptableException } from '@nestjs/common';
import fp from 'fastify-plugin'; 
import { CommonService } from './common.Service';

const authPlugin = (commonService: CommonService): FastifyPluginAsync => {
    const plugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
      fastify.addHook('preHandler', async (req, res) => {
        const body: any = req.body;
        // console.log("body", body);
        // console.log("key", body.key);

        if (req.headers.authorization === undefined) {
          const err = await commonService.getTSL(body.key, '', 'Given token not found', 400);
          throw new NotAcceptableException(err);
        }
        console.log("Execution started...");
      });
    };
    return fp(plugin);
  };

  export default authPlugin;