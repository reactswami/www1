import { faker } from '@faker-js/faker';
import { primaryKey } from '@mswjs/data';


export const autoincrementInteger = (function() {
    let counter = 0;
    return function() { counter++; return counter; };
})();

const generateRanges = () => ({
    includes: faker.internet.ipv4,
    excludes: faker.internet.ipv4
});


export const ip_range_config_model = {
    id: primaryKey(autoincrementInteger),
    name: faker.internet.displayName(),
    enabled: faker.helpers.arrayElement([0,1]),
    ip_ranges: generateRanges()
};

export const createIPRangeConfigs = ({ count }: { count: number }) => {
    return Array.from({length: count}).map(() => ({

    }));
};
