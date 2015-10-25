describe('projectsService', () => {

    let $rootScope;
    let projectsService;

    beforeEach(module('pmApp'));


    beforeEach(inject((_projectsService_, _$rootScope_) => {
        projectsService = _projectsService_;
        $rootScope = _$rootScope_;
    }));


    describe('Empty task object', () => {
        it('name is empty', () => expect(projectsService.getEmptyProject().name).toBe(''));
        it('sp is null', () => expect(projectsService.getEmptyProject().sp).toBe(null));
        it('description is empty', () => expect(projectsService.getEmptyProject().description).toBe(''));

        let date = moment(new Date());
        it(
            'created_at.date has current date in format YYYY-MM-DD',
            () => expect(projectsService.getEmptyProject().created_at.date).toBe(date.format('YYYY-MM-DD'))
        );
        it(
            'created_at.time has current time in format HH:mm',
            () => expect(projectsService.getEmptyProject().created_at.time).toBe(date.format('HH:mm'))
        );
    });


    describe('By default projects variable when resolved', () => {
        let projects;

        beforeEach(() => {
            projectsService.getProjects().then((response) => projects = response);
            $rootScope.$digest();
        });

        it('is empty array', () => expect(projects).toEqual([]));

    });
});