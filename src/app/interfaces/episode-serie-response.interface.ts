export interface EpisodeResponse {
    _id:           string;
    air_date:      Date;
    episodes:      Episode[];
    name:          string;
    overview:      string;
    id:            number;
    poster_path:   string;
    season_number: number;
    vote_average:  number;
}

export interface Episode {
    air_date:        Date;
    episode_number:  number;
    episode_type:    EpisodeType;
    id:              number;
    name:            string;
    overview:        string;
    production_code: string;
    runtime:         number;
    season_number:   number;
    show_id:         number;
    still_path:      string;
    vote_average:    number;
    vote_count:      number;
    crew:            any[];
    guest_stars:     GuestStar[];
}

export enum EpisodeType {
    Standard = "standard",
}

export interface GuestStar {
    character:            string;
    credit_id:            string;
    order:                number;
    adult:                boolean;
    gender:               number;
    id:                   number;
    known_for_department: string;
    name:                 string;
    original_name:        string;
    popularity:           number;
    profile_path:         string;
}
