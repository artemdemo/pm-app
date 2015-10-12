describe('projectsService', function(){

    var $rootScope,
        projectsService;


    beforeEach(module('pmApp'));


    beforeEach(inject(function (_projectsService_, _$rootScope_) {
        projectsService = _projectsService_;
        $rootScope = _$rootScope_;
    }));


    describe('Empty task object', function(){
        it('name is empty', function(){ expect(projectsService.getEmptyProject().name).toBe('') });
        it('sp is null', function(){ expect(projectsService.getEmptyProject().sp).toBe(null) });
        it('description is empty', function(){ expect(projectsService.getEmptyProject().description).toBe('') });

        var date = moment(new Date());
        it('created_at.date has current date in format YYYY-MM-DD', function(){ expect(projectsService.getEmptyProject().created_at.date).toBe(date.format('YYYY-MM-DD')) });
        it('created_at.time has current time in format HH:mm', function(){ expect(projectsService.getEmptyProject().created_at.time).toBe(date.format('HH:mm')) });
    });


    describe('By default projects variable when resolved', function(){
        var projects;

        beforeEach(function(){
            projectsService.getProjects().then(function(response){
                projects = response
            });
            $rootScope.$digest();
        });

        it('is empty array', function(){
            expect(projects).toEqual([]);
        });

    });
});