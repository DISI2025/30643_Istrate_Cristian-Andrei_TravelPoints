import {Attraction} from "../attractionEntity";
import {UserResponse} from "../user/userResponse";

export interface WishlistResponse {
    id: string;
    user: UserResponse;
    attraction: Attraction;
    addedAt: string | Date;
}
