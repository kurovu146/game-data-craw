import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';

export type FaceitRespone = {
  picture: string;
  email: string;
  birthdate: string;
  nickname: string;
  locale: string;
  memberships: string[];
  guid: string;
  given_name: string;
  family_name: string;
  email_verified: string;
  iss: string;
  aud: string;
};

export type FaceitData = {
  player_id: string;
  nickname: string;
  avatar: string;
  country: string;
  cover_image: string;
  platforms: string[];
  games: GameData;
};

export type GameData = {
  csgo: GameDetail;
};

export type GameDetail = {
  region: string;
  game_player_id: string;
  game_player_name: string;
};

export type Game = {
  name: string;
  game_player_id: string;
};

type FaceitPlayer = {
  anticheat_required: true;
  avatar: string;
  game_player_id: string;
  game_player_name: string;
  game_skill_level: number;
  membership: string;
  nickname: string;
  player_id: string;
};
type FaceitFaction = {
  avatar: string;
  faction_id: string;
  leader: string;
  name: string;
  roster: FaceitPlayer[];
  roster_v1: string;
  substituted: boolean;
  type: string;
};
type Item = {
  competition_id: string;
  competition_name: string;
  competition_type: string;
  faceit_url: string;
  finished_at: number;
  game_id: string;
  game_mode: string;
  match_id: string;
  match_type: string;
  max_players: number;
  organizer_id: string;
  playing_players: string[];
  region: string;
  results: {
    score: {
      additionalProp1: number;
      additionalProp2: number;
      additionalProp3: number;
    };
    winner: string;
  };
  started_at: number;
  status: string;
  teams: {
    additionalProp1: {
      avatar: string;
      nickname: string;
      players: [
        {
          avatar: string;
          faceit_url: string;
          game_player_id: string;
          game_player_name: string;
          nickname: string;
          player_id: string;
          skill_level: number;
        },
      ];
      team_id: string;
      type: string;
    };
    additionalProp2: {
      avatar: string;
      nickname: string;
      players: [
        {
          avatar: string;
          faceit_url: string;
          game_player_id: string;
          game_player_name: string;
          nickname: string;
          player_id: string;
          skill_level: number;
        },
      ];
      team_id: string;
      type: string;
    };
    additionalProp3: {
      avatar: string;
      nickname: string;
      players: [
        {
          avatar: string;
          faceit_url: string;
          game_player_id: string;
          game_player_name: string;
          nickname: string;
          player_id: string;
          skill_level: number;
        },
      ];
      team_id: string;
      type: string;
    };
  };
  teams_size: number;
};

export type MatchHistory = {
  end: number;
  from: number;
  items: Item[];
  start: number;
  to: number;
};
export type MatchDetail = {
  best_of: number;
  broadcast_start_time: number;
  broadcast_start_time_label: string;
  calculate_elo: boolean;
  chat_room_id: string;
  competition_id: string;
  competition_name: string;
  competition_type: string;
  configured_at: boolean;
  demo_url: string[];
  faceit_url: string;
  finished_at: number;
  game: string;
  group: boolean;
  match_id: string;
  organizer_id: string;
  region: string;
  results: {
    score: {
      additionalProp1: number;
      additionalProp2: number;
      additionalProp3: number;
    };
    winner: string;
  };
  round: number;
  scheduled_at: number;
  started_at: number;
  status: string;
  teams: {
    faction1: FaceitFaction;
    faction2: FaceitFaction;
  };
  version: number;
  voting: string;
};
export type MatchStatistic = {
  rounds: [
    {
      best_of: string;
      competition_id: string;
      game_id: string;
      game_mode: string;
      match_id: string;
      match_round: string;
      played: string;
      round_stats: {
        Region: string;
        Map: string;
        Winner: string;
        Rounds: string;
        Score: string;
      };
      teams: Team[];
    },
  ];
};
type Team = {
  team_id: string;
  premade: boolean;
  team_stats: {
    'Team Win': string;
    'Team Headshots': string;
    'Second Half Score': string;
    Team: string;
    'Final Score': string;
    'Overtime score': string;
    'First Half Score': string;
  };
  players: Player[];
};
type Player = {
  player_id: string;
  nickname: string;
  player_stats: {
    Assists: string;
    Kills: string;
    'Headshots %': string;
    'Penta Kills': string;
    Deaths: string;
    'Quadro Kills': string;
    Result: string;
    MVPs: string;
    'Triple Kills': string;
    'K/R Ratio': string;
    'K/D Ratio': string;
    Headshots: string;
  };
};

type LifeTime = {
  'K/D Ratio': string;
  'Average Headshots %': string;
  'Average K/D Ratio': string;
  'Total Headshots %': string;
  'Recent Results': string[];
  Wins: string;
  'Longest Win Streak': string;
  'Win Rate %': string;
  'Current Win Streak': string;
  Matches: string;
};
type Segments = {
  img_small: string;
  img_regular: string;
  stats: {
    Wins: string;
    'Average Triple Kills': string;
    Kills: string;
    Rounds: string;
    'Average Assists': string;
    MVPs: string;
    Assists: string;
    'Triple Kills': string;
    Headshots: string;
    'Average MVPs': string;
    'Average K/R Ratio': string;
    'K/D Ratio': string;
    Deaths: string;
    'Average Kills': string;
    'Average K/D Ratio': string;
    'Penta Kills': string;
    'Average Quadro Kills': string;
    'Average Deaths': string;
    'K/R Ratio': string;
    'Average Penta Kills': string;
    'Quadro Kills': string;
    'Total Headshots %': string;
    'Win Rate %': string;
    'Average Headshots %': string;
    'Headshots per Match': string;
    Matches: string;
  };
  type: 'Map';
  mode: '5v5';
  label: 'de_mirage';
};
export type PlayerStatistic = {
  player_id: string;
  game_id: string;
  lifetime: LifeTime;
  segments: Segments[];
};
