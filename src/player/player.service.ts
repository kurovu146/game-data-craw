import { AppError } from '@lib/helper/errors/base.error';
import { PrismaService } from '@lib/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Queue } from 'src/queue/queue';
import { FaceitData, MatchHistory } from './dto/player.dto';
import * as fs from 'fs';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    private prismaService: PrismaService,
    private http: HttpService,
  ) { }

  async getPlayerID() {
    let response;
    // get data from faceit
    try {
      response = await firstValueFrom(
        this.http.get(
          'https://open.faceit.com/data/v4/players/' + process.env.FACEIT_ID,
          {
            headers: {
              Authorization: 'Bearer ' + process.env.FACEIT_API_KEY,
            },
          },
        ),
      );
      response = response.data as FaceitData;
      // console.log("debug_fb: ", response.data)
    } catch (err) {
      throw new AppError('Bad request', 'BAD_REQUEST');
    }
    // does account faceit have csgo?
    if (!response.games || !response.games.csgo) {
      throw new AppError('Faceit account hasnt csgo', 'BAD_REQUEST');
    }
    const queue = new Queue<string>;
    queue.enqueue(response.player_id);
    await this.prismaService.faceitID.create({
      data: {
        player_id: response.player_id,
      }
    })
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
          if (!queue.is_existed(player)) {   
            queue.enqueue(player);
            await this.prismaService.faceitID.create({
              data: {
                player_id: player,
              }
            })
          }
        }
      }
      queue.dequeue(queue.value());
    }
    return "Craw data completed!";
  }

  async getPlayerID2() {
    const queue = new Queue<string>;
    const data = await this.prismaService.faceitID.findMany({});
    for (const player of data) {
      queue.log(player.player_id);
    }
    queue.enqueue(data[data.length - 1].player_id);
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
          if (!queue.is_existed(player)) {
            queue.enqueue(player);
            await this.prismaService.faceitID.create({
              data: {
                player_id: player,
              }
            })
          }
        }
      }
      queue.dequeue(queue.value());
    }
    return "Craw data completed!";
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

  async start() {
    const data = await this.prismaService.faceitID.findMany({});
    if (data.length)
      await this.getPlayerID2();
    else
      await this.getPlayerID();
  }

  async testFile() {
    fs.appendFileSync('data.txt', "kk1" + "\n");
    fs.appendFileSync('data.txt', "kk2" + "\n");
    fs.appendFileSync('data.txt', "kk3" + "\n");
    fs.appendFileSync('data.txt', "kk4" + "\n");
    const data = fs.readFileSync('data.txt', 'utf8');
    let res = data.split("\n");
    return res;
  }

}
