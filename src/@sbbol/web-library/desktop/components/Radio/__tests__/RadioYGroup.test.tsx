import React from 'react';
import renderer from 'react-test-renderer';
import {allure} from '@jest/unit/allure-report';
import {RadioYGroup} from '@sbbol/web-library/desktop/components/Radio/RadioYGroup';
import {Radio} from '@sbbol/web-library/desktop/components/Radio/Radio';

describe('RadioYGroup', () => {
    beforeEach(() => {
        allure.feature('RadioYGroup');
    });

    it('renders correctly', () => {
        const tree = renderer
            .create(
                <RadioYGroup>
                    <Radio>Radio</Radio>
                    <Radio>Radio</Radio>
                    <Radio>Radio</Radio>
                </RadioYGroup>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
