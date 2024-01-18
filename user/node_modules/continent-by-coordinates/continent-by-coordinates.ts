import { continents } from "./data";

const getContinentName = (latitude: number, longitude: number) => {
    for (const continent of continents) {
        const { name, latRange, lonRange } = continent;
        const isLatInRange = latitude >= latRange[0] && latitude <= latRange[1];
        const isLonInRange = longitude >= lonRange[0] && longitude <= lonRange[1];

        if (isLatInRange && isLonInRange) {
            return name;
        }
    }
    return "Unknown";
};

export { getContinentName };