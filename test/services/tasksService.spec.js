describe('tasksService', () => {

    let $rootScope;
    let $httpBackend;
    let $q;
    let tasksService;

    let tasksMock = [
        {
            id: '1',
            name: 'task 1',
            created_at: '2015-10-25 08:50:44',
            sp: '1',
            status: '1'
        },
        {
            id: '2',
            name: 'task 2',
            created_at: '2015-10-25 08:50:44',
            sp: '1',
            status: '2'
        },
        {
            id: '3',
            name: 'task 3',
            created_at: '2015-10-25 08:50:44',
            sp: '1',
            status: '2'
        },
        {
            id: '4',
            name: 'task 4',
            created_at: '2015-10-25 08:50:44',
            sp: '1',
            status: '3'
        },
        {
            id: '5',
            name: 'task 5',
            created_at: '2015-10-25 08:50:44',
            sp: '1',
            status: '3'
        }
    ];

    beforeEach(module('pmApp'));

    beforeEach(inject((_tasksService_, _$rootScope_, _$httpBackend_, _$q_) => {
        tasksService = _tasksService_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;

        $httpBackend.when('GET', 'http://localhost/pm/api/public/tasks/open')
            .respond(tasksMock);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('should fetch tasks', () => {
        $httpBackend.expectGET('http://localhost/pm/api/public/tasks/open');
        tasksService.loadOpenTasks();
        $httpBackend.flush();
    });


    describe('In task list', () => {
        beforeEach(() => {
            tasksService.loadOpenTasks();
            $httpBackend.flush();
        });

        it('all tasks should be in DESC order', () => {
            let loadedIdList;

            let deferred = $q.defer();
            let promise = deferred.promise;

            promise.then(function (tasks) {
                loadedIdList = tasks.map((task) => task.id);
            });

            tasksService.getTasks().then(function(response) {
                deferred.resolve(response);
            });

            $rootScope.$digest();

            expect(loadedIdList).toEqual(['5', '4', '3', '2', '1']);
        })
    });


    describe('After saving new task', () => {
        beforeEach(() => {
            $httpBackend.when('POST', 'http://localhost/pm/api/public/tasks')
                .respond({
                    ErrorStatus: 0,
                    id: '155'
                });

            tasksService.loadOpenTasks();
            $httpBackend.flush();
        });

        it('all tasks should be in DESC order', () => {
            let loadedIdList;

            let deferred = $q.defer();
            let promise = deferred.promise;

            promise.then(function (tasks) {
                loadedIdList = tasks.map((task) => task.id);
            });

            tasksService.saveTask({
                name: 'task 14',
                created_at: '2015-10-25 08:50:44',
                sp: '1',
                status: '3'
            }, []).then(() => {
                tasksService.getTasks().then(function(response) {
                    deferred.resolve(response);
                });
            });

            $httpBackend.flush();

            $rootScope.$digest();

            expect(loadedIdList).toEqual(['155', '5', '4', '3', '2', '1']);
        })
    });

});