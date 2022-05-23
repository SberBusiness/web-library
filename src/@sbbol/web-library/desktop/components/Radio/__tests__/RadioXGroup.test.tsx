import React from 'react';
import renderer from 'react-test-renderer';
import {allure} from '@jest/unit/allure-report';
import {RadioXGroup} from '@sbbol/web-library/desktop/components/Radio/RadioXGroup';
import {Radio} from '@sbbol/web-library/desktop/components/Radio/Radio';

describe('RadioXGroup', () => {
    beforeEach(() => {
        allure.feature('RadioXGroup');
    });

    it('renders correctly', () => {
        const tree = renderer
            .create(
                <RadioXGroup>
                    <Radio>Radio</Radio>
                    <Radio>Radio</Radio>
                    <Radio>Radio</Radio>
                </RadioXGroup>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
