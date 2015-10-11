<?php namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Task;

class TasksController extends Controller {

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
        // return csrf_token();
    }


    /**
     * Add task to the DB
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
            'priority'=>'required|numeric',
            'status'=>'required|numeric',
            'sp'=>'required|numeric',
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator -> fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $task = new Task;
            $task -> name = $request -> get('name');
            $task -> description = $request -> get('description');
            $task -> priority = $request -> get('priority');
            $task -> status = $request -> get('status');
            $task -> sp = $request -> get('sp');

            $task -> save();

            return response() -> json(array(
                'id' => $task -> id,
                'ErrorStatus' => 0
            ), 201);
        }
    }


    /**
     * Update task in the DB
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
            'priority'=>'required|numeric',
            'status'=>'required|numeric',
            'sp'=>'required|numeric',
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $task = Task::find($request -> get('id'));
            $task -> name = $request -> get('name');
            $task -> description = $request -> get('description');
            $task -> priority = $request -> get('priority');
            $task -> status = $request -> get('status');
            $task -> sp = $request -> get('sp');

            $task -> save();

            return response() -> json(array(
                'id' => $task -> id,
                'ErrorStatus' => 0
            ), 201);
        }
    }

    /**
     * Delete task
     *
     * @param null $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteTask($id = null)
    {
        if (!$id) {
            return response() -> json(array(
                'message' => 'Id is required',
                'ErrorStatus' => 13
            ));
        } else {
            // $user = User::find( $user_id );

            $task = Task::find($id);
            $task -> delete();
        }

        return response() -> json(array(
            'ErrorStatus' => 0
        ), 201);
    }


    /**
     * Return all open tasks that current user have access to
     * Open tasks are tasks that NOT DONE and NOT CLOSED
     */
    public function getOpen()
    {
        // $response = file_get_contents('tasks-example.json');
        // return response()->json( json_decode($response) );

        $tasks = Task::where('author', 0)
            -> orderBy('id', 'desc')
            -> get();

        return response()->json( $tasks );
    }

}