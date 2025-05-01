import {Attraction} from "../attractionEntity";
import {UserResponse} from "../user/userResponse";

export interface VisitResponse {
    id: string;
    attraction: Attraction;
    user: UserResponse;
    visitTimestamp: string | Date;
}
