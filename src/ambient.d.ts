type Player = {
    id: number;
    full_name ?: string;
    web_name ?: string;
    position ?: string;
    multiplier: number;
    is_captain: boolean;
};

type PlayerPick = {
    element: number;
    position ?: string;
    full_name ?: string;
    web_name ?: string;
    multiplier: number;
    is_captain: boolean;
    is_vice_captain: boolean;
};

type PlayerElement = {
    chance_of_playing_next_round: number | null;
    chance_of_playing_this_round: number | null;
    code: number;
    cost_change_event: number;
    cost_change_event_fall: number;
    cost_change_start: number;
    cost_change_start_fall: number;
    dreamteam_count: number;
    element_type: number;
    ep_next: string;
    ep_this: string;
    event_points: number;
    first_name: string;
    form: string;
    id: number;
    in_dreamteam: boolean;
    news: string;
    news_added: string;
    now_cost: number;
    photo: string;
    points_per_game: string;
    second_name: string;
    selected_by_percent: string;
    special: boolean;
    squad_number: number | null;
    status: string;
    team: number;
    team_code: number;
    total_points: number;
    transfers_in: number;
    transfers_in_event: number;
    transfers_out: number;
    transfers_out_event: number;
    value_form: string;
    value_season: string;
    web_name: string;
    minutes: number;
    goals_scored: number;
    assists: number;
    clean_sheets: number;
    goals_conceded: number;
    own_goals: number;
    penalties_saved: number;
    penalties_missed: number;
    yellow_cards: number;
    red_cards: number;
    saves: number;
    bonus: number;
    bps: number;
    influence: string;
    creativity: string;
    threat: string;
    ict_index: string;
    starts: number;
    expected_goals: string;
    expected_assists: string;
    expected_goal_involvements: string;
    expected_goals_conceded: string;
    influence_rank: number;
    influence_rank_type: number;
    creativity_rank: number;
    creativity_rank_type: number;
    threat_rank: number;
    threat_rank_type: number;
    ict_index_rank: number;
    ict_index_rank_type: number;
    corners_and_indirect_freekicks_order: number | null;
    corners_and_indirect_freekicks_text: string;
    direct_freekicks_order: number | null;
    direct_freekicks_text: string;
    penalties_order: number | null;
    penalties_text: string;
    expected_goals_per_90: number;
    saves_per_90: number;
    expected_assists_per_90: number;
    expected_goal_involvements_per_90: number;
    expected_goals_conceded_per_90: number;
    goals_conceded_per_90: number;
    now_cost_rank: number;
    now_cost_rank_type: number;
    form_rank: number;
    form_rank_type: number;
    points_per_game_rank: number;
    points_per_game_rank_type: number;
    selected_rank: number;
    selected_rank_type: number;
    starts_per_90: number;
    clean_sheets_per_90: number;
};

type PlayerPerformance = {
    web_name ?: string;
    full_name ?: string;
    position ?: string;
    is_captain: boolean;
    total_points: string;
    bonus: any;
    pct_selected_by: string;
}

type TransferEntryPerformance ={
    player_in: PlayerPerformance;
    player_out: PlayerPerformance;
}

type TeamPerformance = {
    total_points: string;
    highest_points: string;
    average_points: string;
    first_team_performance: PlayerPerformance[];
    transfers_performance: TransferEntryPerformance[];
};

type ChipPlay = {
    chip_name: string;
    num_played: number;
};

type TopElementInfo = {
    id: number;
    points: number;
};

type GameweekEvent = {
    id: number;
    name: string;
    deadline_time: string;
    release_time: string | null;
    average_entry_score: number;
    finished: boolean;
    data_checked: boolean;
    highest_scoring_entry: number;
    deadline_time_epoch: number;
    deadline_time_game_offset: number;
    highest_score: number;
    is_previous: boolean;
    is_current: boolean;
    is_next: boolean;
    cup_leagues_created: boolean;
    h2h_ko_matches_created: boolean;
    ranked_count: number;
    chip_plays: ChipPlay[];
    most_selected: number;
    most_transferred_in: number;
    top_element: number;
    top_element_info: TopElementInfo;
    transfers_made: number;
    most_captained: number;
    most_vice_captained: number;
};

type TransferEntry = {
    element_in: number;
    element_in_cost: number;
    element_out: number;
    element_out_cost: number;
    entry: number;
    event: number;
    time: string;
  }