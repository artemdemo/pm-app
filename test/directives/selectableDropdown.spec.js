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
                id: 1,
                name: 'task 1',
                status: '1'
            },
            {
                id: 2,
                name: 'task 2',
                status: '2'
            },
            {
                id: 3,
                name: 'task 3',
                status: '2'
            },
            {
                id: 4,
                name: 'task 4',
                status: '3'
            },
            {
                id: 5,
                name: 'task 5',
                status: '3'
            }
        ];

        element = $compile(`<selectable-dropdown
                                items="tasks"
                                name-property="name"
                                selected-task="selectedTask"
                                mode="KeepValue"
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
        `List of tasks contain 5 items`,
        () => {
            expect(element[0].querySelectorAll('.selectable-dropdown__list-item').length).toEqual(5)
        }
    );

    it(
        `First item name is equal to 'task 1'`,
        () => expect(element[0].querySelectorAll('.selectable-dropdown__list-item')[0]
                .querySelector('.selectable-dropdown__list-item-name').textContent).toEqual('task 1')
    );


    describe('Selected task', () => {
        beforeEach(() => {
            $rootScope.selectedTask = $rootScope.tasks[1];
            $rootScope.$digest();
        });

        it(
            `Input value is equal to 'task 2'`,
            () => expect(element.find('input')[0].value).toEqual('task 2')
        );

        it(
            `List of tasks contain 1 item, when keeping value`,
            () => {
                expect(element[0].querySelectorAll('.selectable-dropdown__list-item').length).toEqual(1)
            }
        );

    });
});