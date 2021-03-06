import {AccordionView} from '@sbbol/web-library/desktop/components/AccordionView/AccordionView';
import {AccordionBase} from '@sbbol/web-library/desktop/components/AccordionBase/protected/AccordionBase';
import {AccordionViewHeader} from '@sbbol/web-library/desktop/components/AccordionView/components/AccordionViewHeader';
import {allure} from '@jest/unit/allure-report';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import * as React from 'react';

jest.mock('@sberbusiness/icons/CaretdownSrvxIcon16', () => ({
    CaretdownSrvxIcon16: 'svg',
}));

describe('AccordionView', () => {
    beforeEach(() => {
        allure.feature('AccordionView');
    });

    it('renders correctly', () => {
        const tree = renderer
            .create(
                <AccordionView>
                    <AccordionView.Header>Test</AccordionView.Header>
                    <AccordionView.Body>Test</AccordionView.Body>
                </AccordionView>
            )
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('calls onToggle', () => {
        const handleToggle = jest.fn();
        const wrapper = shallow(
            <AccordionView onToggle={handleToggle}>
                <AccordionView.Header>Test</AccordionView.Header>
                <AccordionView.Body>Test</AccordionView.Body>
            </AccordionView>
        );

        wrapper.find(AccordionBase).simulate('toggle');
        expect(handleToggle).toHaveBeenCalled();
    });

    it('opens correctly', () => {
        const component = renderer.create(
            <AccordionView>
                <AccordionView.Header>Test</AccordionView.Header>
                <AccordionView.Body>Test</AccordionView.Body>
            </AccordionView>
        );

        component.root.findByType(AccordionViewHeader).props.toggle();
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('closes correctly', () => {
        const component = renderer.create(
            <AccordionView>
                <AccordionView.Header>Test</AccordionView.Header>
                <AccordionView.Body>Test</AccordionView.Body>
            </AccordionView>
        );

        component.root.findByType(AccordionViewHeader).props.toggle();
        component.root.findByType(AccordionViewHeader).props.toggle();
        expect(component.toJSON()).toMatchSnapshot();
    });
});
