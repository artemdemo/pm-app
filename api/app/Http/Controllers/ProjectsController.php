<?php namespace App\Http\Controllers;

use DB;
use Validator;
use Illuminate\Http\Request;

use App\Project;

class ProjectsController extends Controller {

    private $rules = array(
        'name'=>'required',
        'description'=>'required',
    );

    /**
     * Create a new controller instance.
     *
     */
    public function __construct()
    {
        $this->middleware('cors');
    }

    /**
     * Show the application dashboard to the user.
     *
     */
    public function getIndex()
    {
        return 'This is projects controller';
    }


    /**
     * Add project to the DB
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function postIndex(Request $request)
    {
        // $user_id = Auth::id();
        // if ( ! $user_id ) return response() -> json( $this -> AUTH_ERROR, 401 );

        $validator = Validator::make($request->all(), $this -> rules);

        if ($validator -> fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $project = $this -> updatedProject($request);

            return response() -> json(array(
                'id' => $project -> id,
                'ErrorStatus' => 0
            ), 201);
        }
    }


    /**
     * Update project in the DB
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function putIndex(Request $request)
    {
        // $user_id = Auth::id();
        // if ( ! $user_id ) return response() -> json( $this -> AUTH_ERROR, 401 );

        $rules = $this -> rules;
        $rules['id'] = 'required|integer';

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $project = $this -> updatedProject($request);

            return response() -> json(array(
                'id' => $project -> id,
                'ErrorStatus' => 0
            ), 201);
        }
    }


    /**
     * Delete project
     *
     * @param null $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteProject($id = null)
    {
        if (!$id) {
            return response() -> json(array(
                'message' => 'Id is required',
                'ErrorStatus' => 13
            ));
        } else {
            // $user = User::find( $user_id );

            $project = Project::find($id);
            $project -> delete();
        }

        return response() -> json(array(
            'ErrorStatus' => 0
        ), 201);
    }


    /**
     * Return all open projects that current user have access to
     */
    public function getOpen()
    {
        // $response = file_get_contents('projects-example.json');
        // return response()->json( json_decode($response) );

        $projects = Project::where('author', 0)
            -> orderBy('id', 'desc')
            -> get();

        return response()->json( $projects );
    }


    /**
     * Update project.
     * Function will update project if it exists or will add new one if not
     *
     * @param $projectRequest
     * @return Project
     */
    private function updatedProject($projectRequest)
    {
        if ( $projectRequest -> get('id') ) {
            $project = Project::find($projectRequest -> get('id'));
        } else {
            $project = new Project;
        }

        $project -> name = $projectRequest -> get('name');
        $project -> description = $projectRequest -> get('description');
        $project -> save();

        // task can't be parent of itself
        $subtasks = $projectRequest -> get('subtasks');
        $current_project_in_subtasks = array_search($project -> id, $subtasks);
        if ($current_project_in_subtasks !== false) {
            array_splice($subtasks, $current_project_in_subtasks, 1);
        }

        DB::table('tasks')
            -> where('project', $project -> id)
            -> update(['project' => null]);

        if (count($subtasks) > 0) {
            DB::table('tasks')
                -> whereIn('id', $subtasks)
                -> update(['project' => $project -> id]);
        }

        return $project;
    }

}