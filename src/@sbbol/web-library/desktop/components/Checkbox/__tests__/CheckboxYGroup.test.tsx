import React from 'react';
import renderer from 'react-test-renderer';
import {allure} from '@jest/unit/allure-report';
import {CheckboxYGroup} from '@sbbol/web-library/desktop/components/Checkbox/CheckboxYGroup';
import {Checkbox} from '@sbbol/web-library/desktop/components/Checkbox/Checkbox';

jest.mock('@sberbusiness/icons/CheckboxtickStsIcon16', () => ({
    CheckboxtickStsIcon16: 'svg',
}));

jest.mock('@sberbusiness/icons/CheckboxbulkStsIcon16', () => ({
    CheckboxbulkStsIcon16: 'svg',
}));

describe('CheckboxYGroup', () => {
    beforeEach(() => {
        allure.feature('CheckboxYGroup');
    });

    it('renders correctly', () => {
        const tree = renderer
            .create(
                <CheckboxYGroup>
                    <Checkbox>Checkbox</Checkbox>
                    <Checkbox>Checkbox</Checkbox>
                    <Checkbox>Checkbox</Checkbox>
                </CheckboxYGroup>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
