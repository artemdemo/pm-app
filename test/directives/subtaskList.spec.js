describe('subtaskList directive', () => {
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
                description: 'task 1 description'
            },
            {
                id: 2,
                name: 'task 2',
                description: 'task 2 description'
            }
        ];

        element = $compile(`<subtask-list
                                class="subtask-list subtask-list_task-modal"
                                ng-show="tasks.length > 0"
                                subtasks="tasks"
                                title="Subtasks:"></subtask-list>`)($rootScope);
        $rootScope.$digest();
    }));

    it(
        `Title is equal to 'Subtasks:'`,
        () => {
            expect(element[0].querySelector('.subtask-list__title').textContent).toEqual('Subtasks:')
        }
    );

    it(
        `There is 2 child elements`,
        () => expect(element[0].querySelectorAll('.subtask-item').length).toEqual(2)
    );

    it(
        `Title of the first task is 'task 1'`,
        () => expect(element[0].querySelectorAll('.subtask-item')[0]
            .querySelector('.task-item__title-text').textContent).toEqual('task 1')
    );

    it(
        `Description of the first task is 'task 1 description'`,
        () => expect(element[0].querySelectorAll('.subtask-item')[0]
            .querySelector('.subtask-item__description').textContent).toEqual('task 1 description')
    );

});