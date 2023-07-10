import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { clientValidationSchema } from 'validationSchema/clients';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getClients();
    case 'POST':
      return createClient();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getClients() {
    const data = await prisma.client
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'client'));
    return res.status(200).json(data);
  }

  async function createClient() {
    await clientValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.analytics?.length > 0) {
      const create_analytics = body.analytics;
      body.analytics = {
        create: create_analytics,
      };
    } else {
      delete body.analytics;
    }
    if (body?.community?.length > 0) {
      const create_community = body.community;
      body.community = {
        create: create_community,
      };
    } else {
      delete body.community;
    }
    if (body?.diet_plan?.length > 0) {
      const create_diet_plan = body.diet_plan;
      body.diet_plan = {
        create: create_diet_plan,
      };
    } else {
      delete body.diet_plan;
    }
    if (body?.health_tip?.length > 0) {
      const create_health_tip = body.health_tip;
      body.health_tip = {
        create: create_health_tip,
      };
    } else {
      delete body.health_tip;
    }
    if (body?.workout_plan?.length > 0) {
      const create_workout_plan = body.workout_plan;
      body.workout_plan = {
        create: create_workout_plan,
      };
    } else {
      delete body.workout_plan;
    }
    const data = await prisma.client.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
