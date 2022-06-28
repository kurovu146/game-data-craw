import { AppError } from '@lib/helper/errors/base.error';
import { PrismaService } from '@lib/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Queue } from 'src/queue/queue';
import { MatchHistory } from './dto/player.dto';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);
  private total: number = 0;
  private duplicate: number = 0;

  constructor(
    private prismaService: PrismaService,
    private http: HttpService,
  ) { }

  async getPlayerID() {
    const queue = new Queue<string>;
    queue.enqueue(process.env.FACEIT_ID);
    await this.prismaService.faceitID.create({
      data: {
        player_id: process.env.FACEIT_ID,
      }
    })
    return this.progress(queue);
  }

  async getPlayerID2() {
    const queue = new Queue<string>;
    const data = await this.prismaService.faceitID.findFirst({
      orderBy: {
        uid: 'desc'
      }
    });
    queue.enqueue(data.player_id);
    return this.progress(queue);
  }

  async getCSGOMatches(
    player_uid: string,
    offset?: number,
    limit?: number,
    from?: string,
    to?: string,
  ): Promise<MatchHistory> {
    if (!offset) {
      offset = 0;
    }
    if (!limit) {
      limit = 1;
    }
    if (!from) {
      from = '';
    } else {
      from = '&from=' + from;
    }
    if (!to) {
      to = '';
    } else {
      to = '&to=' + to;
    }

    let matches: MatchHistory;
    try {
      let _matches = await firstValueFrom(
        this.http.get(
          `https://open.faceit.com/data/v4/players/${player_uid}/history?game=csgo${from}${to}&offset=${offset}&limit=${limit}`,
          {
            headers: {
              Authorization: 'Bearer ' + process.env.FACEIT_API_KEY,
            },
          },
        ),
      );
      matches = _matches.data as MatchHistory;
      // console.log('matches: ' + matches);
    } catch (err) {
      throw new AppError('firstValueFrom: Bad request', 'BAD_REQUEST');
    }
    return matches;
  }

  async progress(queue: Queue<string>) {
    while (queue.size) {
      let matches_of_player: MatchHistory;
      try {
        matches_of_player = await this.getCSGOMatches(
          queue.value(),
          0,
          10,
        );
      } catch(err) {
        queue.dequeue(queue.value());
        continue;
      }
      for (const match of matches_of_player.items) {
        for (const player of match.playing_players) {
          try{
            this.total++;
            await this.prismaService.faceitID.create({
              data: {
                player_id: player,
              }
            })
          }
          catch(er) {
            this.duplicate++;
            continue;
          }
          queue.enqueue(player);
        }
      }
      queue.dequeue(queue.value());
    }
    return "Craw data completed!";
  }

  async start() {
    const data = await this.prismaService.faceitID.findMany({
      skip: 0,
      take: 2,
      orderBy: {
        uid: 'desc'
      }
    });
    if (data.length)
      await this.getPlayerID2();
    else
      await this.getPlayerID();
  }

  async ratioDuplicate() {
    return "duplicate = " + this.duplicate + " total = " + this.total + " duplicate/total = " + (this.duplicate/this.total);
  }
}
