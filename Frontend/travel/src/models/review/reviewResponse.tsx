import {Attraction} from "../attractionModel";
import {UserResponse} from "../user/userResponse";

export interface ReviewResponse {
    id: string,
    attraction: Attraction,
    user: UserResponse,
    rating: number,
    comment: string,
    createdAt: string | Date,

}
