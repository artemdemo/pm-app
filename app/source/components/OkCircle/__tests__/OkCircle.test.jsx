import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import OkCircle from '../OkCircle';

describe('<OkCircle>', () => {
    it('empty render', () => {
        const tree = renderer.create(
            <OkCircle />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with text', () => {
        const tree = renderer.create(
            <OkCircle >some text</OkCircle>,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with done status', () => {
        const tree = renderer.create(
            <OkCircle doneStatus />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should trigger onChange', () => {
        const onChangeMock = jest.fn();
        const wrapper = mount(
            <OkCircle
                onChange={onChangeMock}
            >
                some text
            </OkCircle>
        );
        wrapper.find('.ok-circle-container').simulate('click');
        expect(onChangeMock).toBeCalled();
    });
});
