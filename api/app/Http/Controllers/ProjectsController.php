<?php namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;

class ProjectsController extends Controller {

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

        $rules = array(
            'name'=>'required',
            'description'=>'required',
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator -> fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $project = new Project;
            $project -> name = $request -> get('name');
            $project -> description = $request -> get('description');
            $project -> save();

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

        $rules = array(
            'id'=>'required|numeric',
            'name'=>'required',
            'description'=>'required',
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $project = Project::find($request -> get('id'));
            $project -> name = $request -> get('name');
            $project -> description = $request -> get('description');
            $project -> save();

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

}