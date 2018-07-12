import React from 'react';
import renderer from 'react-test-renderer';
import Icon from '../Icon';

describe('<Icon>', () => {
    it('should be rendered with icon name', () => {
        const tree = renderer.create(
            <Icon name='fire' />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered with className', () => {
        const tree = renderer.create(
            <Icon name='fire' className='some-class' />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered with "in text" class', () => {
        const tree = renderer.create(
            <Icon name='fire' inText />,
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should throw if there is no name', () => {
        expect(() => {
            Icon({ name: '' });
        }).toThrow();
    });
});
