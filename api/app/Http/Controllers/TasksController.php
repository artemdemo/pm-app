<?php namespace App\Http\Controllers;

class TasksController extends Controller {

    /**
     * Create a new controller instance.
     *
     */
    public function __construct()
    {
    }

    /**
     * Show the application dashboard to the user.
     *
     */
    public function getIndex()
    {
        return 'This is tasks controller';
    }

    /**
     * Return all open tasks that current user have access to
     * Open tasks ara tasks that NOT DONE and NOT CLOSED
     */
    public function getOpen()
    {
        $response = file_get_contents('tasks-example.json');
        return response()->json( json_decode($response) );
    }

}