import React from 'react';
import renderer from 'react-test-renderer';
import {allure} from '@jest/unit/allure-report';
import {CheckboxXGroup} from '@sbbol/web-library/desktop/components/Checkbox/CheckboxXGroup';
import {Checkbox} from '@sbbol/web-library/desktop/components/Checkbox/Checkbox';

jest.mock('@sberbusiness/icons/CheckboxtickStsIcon16', () => ({
    CheckboxtickStsIcon16: 'svg',
}));

jest.mock('@sberbusiness/icons/CheckboxbulkStsIcon16', () => ({
    CheckboxbulkStsIcon16: 'svg',
}));

describe('CheckboxXGroup', () => {
    beforeEach(() => {
        allure.feature('CheckboxXGroup');
    });

    it('renders correctly', () => {
        const tree = renderer
            .create(
                <CheckboxXGroup>
                    <Checkbox>Checkbox</Checkbox>
                    <Checkbox>Checkbox</Checkbox>
                    <Checkbox>Checkbox</Checkbox>
                </CheckboxXGroup>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
