import express from "express";
import { PrismaClient } from "@prisma/client";
import { convertHourStringToMinute } from "./utils/convert-hour-string-to-minute";
import { convertMinutesToHourString } from "./utils/convert-minutes-to-hour-string";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors({ origin: '*' }));

app.get("/games", async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        }
      }
    }
  });
  return response.status(200).json(games);
});

app.get('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      gameId: true,
      name: true,
      yearsPlaying: true,
      discord: true,
      weekDays: true,
      hourStart: true,
      hourEnd: true,
      useVoiceChannel: true,
      createdAt: true
    }, where: { gameId },
    orderBy: {
      createdAt: "desc",
    }
  });
  return response.status(200).json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hoursStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd),
    }
  }));
});

app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id;
  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    }, where: { id: adId },
  })
  return response.status(200).json({ discord: ad.discord });
});

app.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;
  const body: any = request.body;
  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinute(body.hourStart),
      hourEnd: convertHourStringToMinute(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    }
  });

  return response.status(201).json(ad); 
});

const PORT: number = 3333;
app.listen(PORT, () => console.log(`server running... PORT (${PORT})`));

function cors(arg0: {}): any {
  throw new Error("Function not implemented.");
}
