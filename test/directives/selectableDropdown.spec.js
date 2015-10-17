describe('selectableDropdown directive', () => {
    let $compile;
    let $templateCache;
    let $rootScope;

    let element;

    beforeEach(module('pmApp'));
    beforeEach(module('my.templates'));

    beforeEach(inject((_$compile_, _$rootScope_, _$templateCache_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $templateCache = _$templateCache_;

        $rootScope.tasks = [
            {
                name: 'task 1',
                status: '1'
            },
            {
                name: 'task 2',
                status: '2'
            }
        ];

        element = $compile(`<selectable-dropdown
                                items="tasks"
                                placeholder="Test placeholder"
                                label="Test label">
                            </selectable-dropdown>`)($rootScope);
        $rootScope.$digest();
    }));

    it(`Contain <input> tag`, () => expect(element.find('input').length).toEqual(1));

    it(
        `<label> text should be 'Test label'`,
        () => expect(element[0].querySelector('.selectable-dropdown__label-text').textContent).toEqual('Test label')
    );

    it(
        `<input>'s placeholder is equal to 'Test placeholder'`,
        () => expect(element.find('input')[0].getAttribute('placeholder')).toEqual('Test placeholder')
    );

    it(
        `List of tasks contain 2 items`,
        () => expect(element[0].querySelectorAll('.selectable-dropdown__list-item').length).toEqual(2)
    );

    it(
        `First item name is equal to 'task 1'`,
        () => expect(element[0].querySelectorAll('.selectable-dropdown__list-item')[0]
                .querySelector('.selectable-dropdown__list-item-name').textContent).toEqual('task 1')
    );
});