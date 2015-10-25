<?php namespace App\Http\Controllers;

use DB;
use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Task;

class TasksController extends Controller {

    private $rules = array(
        'name'=>'required',
        'subtasks'=>'array',
        'priority'=>'required|numeric',
        'status'=>'required|numeric',
        'sp'=>'required|numeric',
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


        $validator = Validator::make($request->all(), $this -> rules);

        if ($validator -> fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $task = $this -> updatedTask($request);

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

            $task = $this -> updatedTask($request);

            return response() -> json(array(
                'id' => $task -> id,
                'ErrorStatus' => 0
            ), 201);
        }
    }


    /**
     * Delete task
     *
     * @param string $id
     * @param string $removeSubtasks
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteTask($id = null, $removeSubtasks = 'false')
    {
        if (!$id) {
            return response() -> json(array(
                'message' => 'Id is required',
                'ErrorStatus' => 13
            ));
        } else {
            // $user = User::find( $user_id );

            Task::find($id) -> delete();

            if ($removeSubtasks == 'false') {
                Task::where('parent', $id) -> update(['parent' => null]);
            } else {
                Task::where('parent', $id) -> delete();
            }
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


    /**
     * Update task.
     * Function will update task if it exists or will add new one if not
     *
     * @param $taskRequest
     * @return Task
     */
    private function updatedTask($taskRequest)
    {
        if ( $taskRequest -> get('id') ) {
            $task = Task::find($taskRequest -> get('id'));
        } else {
            $task = new Task;
        }

        $task -> name = $taskRequest -> get('name');
        $task -> description = $taskRequest -> get('description');
        $task -> priority = $taskRequest -> get('priority');
        $task -> status = $taskRequest -> get('status');
        $task -> project = $taskRequest -> get('project');
        $task -> sp = $taskRequest -> get('sp');
        $task -> save();

        // task can't be parent of itself
        $subtasks = $taskRequest -> get('subtasks');
        $current_task_in_subtasks = array_search($task -> id, $subtasks);
        if ($current_task_in_subtasks !== false) {
            array_splice($subtasks, $current_task_in_subtasks, 1);
        }

        DB::table('tasks')
            -> where('parent', $task -> id)
            -> update(['parent' => null]);

        if (count($subtasks) > 0) {
            DB::table('tasks')
                -> whereIn('id', $subtasks)
                -> update(['parent' => $task -> id]);
        }

        return $task;
    }

}