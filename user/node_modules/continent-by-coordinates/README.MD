# Continent-by-coordinates

[![npm version](https://badge.fury.io/js/continent-by-coordinates.svg)](https://badge.fury.io/js/continent-by-coordinates)

A simple npm package that helps you find the continent name by providing longitude and latitude coordinates.

## Installation

```bash
npm install continent-by-coordinates

### Usage javascript
import {getContinentName} from 'continent-by-coordinates';

const longitude = 45.1234;
const latitude = 23.5678;

const continent = getContinentName(longitude, latitude);

console.log(`The coordinates are in ${continent}.`);
### API
continentByCoordinates(longitude: number, latitude: number): string
Returns the continent name for the given longitude and latitude.

### Contributing
Contributions are welcome! Please open an issue or submit a pull request.

### License
This project is licensed under the ISC License - see the LICENSE file for details.

Author
gyanendrapc
Acknowledgments
Inspired by the need to easily determine the continent from coordinates.
