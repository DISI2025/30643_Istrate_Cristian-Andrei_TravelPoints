import {Attraction} from "../../models/attractionEntity";

export const attractions: Attraction[] = [
    {
        id: 1,
        name: 'Eiffel Tower',
        descriptionText: 'Iconic landmark',
        descriptionAudio: 'idk.mp3',
        location: 'Paris',
        offers: 'Free tour included',
        latitude: 48.8584,
        longitude: 2.2945,
        price: 25,
        oldPrice: 30,
    },
    {
        id: 2,
        name: 'Statue of Liberty',
        descriptionText: 'Historic statue',
        descriptionAudio: 'idk.mp3',
        location: 'NYC',
        offers: 'Guided tour',
        latitude: 40.6892,
        longitude: -74.0445,
        price: 20,
        oldPrice: 25,
    },
];