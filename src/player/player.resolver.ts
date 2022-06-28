import { PlayerService } from './player.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PlayerResolver {
  constructor(private PlayerService: PlayerService) { }

  @Mutation(() => String, { nullable: true })
  async getPlayerID(): Promise<String> {
    return await this.PlayerService.getPlayerID();
  }

  @Mutation(() => String, { nullable: true })
  async getPlayerID2(): Promise<String> {
    return await this.PlayerService.getPlayerID2();
  }

  @Mutation(() => Boolean, { nullable: true })
  async start(): Promise<Boolean> {
    await this.PlayerService.start();
    return true;
  }

  @Query(() => String, { nullable: true })
  async ratioDuplicate(): Promise<String> {
    return await this.PlayerService.ratioDuplicate();
  }
}
