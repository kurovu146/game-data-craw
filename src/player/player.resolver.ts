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


  @Query(() => [String], { nullable: true })
  async testFile(): Promise<String[]> {
    return await this.PlayerService.testFile();
  }
}
