<?php namespace App\Http\Controllers;

class ProjectsController extends Controller {

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
        return 'This is projects controller';
    }

    /**
     * Return all open projects that current user have access to
     */
    public function getOpen()
    {
        $response = file_get_contents('projects-example.json');
        return response()->json( json_decode($response) );
    }

}