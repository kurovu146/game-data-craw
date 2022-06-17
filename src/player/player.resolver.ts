import { PlayerService } from './player.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PlayerResolver {
    constructor(private PlayerService: PlayerService) { }

    @Query(() => String, { nullable: true })
    async getPlayerId(
        @Args('player_id') player_id: string,
      ): Promise<String> {
        return "ok";//await this.PlayerService.getPlayerId(player_id);
      }

}
