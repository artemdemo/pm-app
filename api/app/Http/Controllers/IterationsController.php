<?php namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;

class IterationsController extends Controller {

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
        return 'This is iterations controller';
    }


    /**
     * Add iteration to the DB
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
            'start'=>'required|date',
            'duration'=>'required|integer',
            'sp_available'=>'required|integer',
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator -> fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $iteration = new Iteration;
            $iteration -> name = $request -> get('name');
            $iteration -> description = $request -> get('description');
            $iteration -> start = $request -> get('start');
            $iteration -> duration = $request -> get('duration');
            $iteration -> sp_available = $request -> get('sp_available');
            $iteration -> save();

            return response() -> json(array(
                'id' => $iteration -> id,
                'ErrorStatus' => 0
            ), 201);
        }
    }


    /**
     * Update iteration in the DB
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function putIndex(Request $request)
    {
        // $user_id = Auth::id();
        // if ( ! $user_id ) return response() -> json( $this -> AUTH_ERROR, 401 );

        $rules = array(
            'id'=>'required|integer',
            'name'=>'required',
            'description'=>'required',
            'start'=>'required|date',
            'duration'=>'required|integer',
            'sp_available'=>'required|integer',
        );

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {

            return response() -> json(array(
                'message' => $validator->messages(),
                'ErrorStatus' => 13
            ));

        } else {

            // $user = User::find( $user_id );

            $iteration = Iteration::find($request -> get('id'));
            $iteration -> name = $request -> get('name');
            $iteration -> description = $request -> get('description');
            $iteration -> start = $request -> get('start');
            $iteration -> duration = $request -> get('duration');
            $iteration -> sp_available = $request -> get('sp_available');
            $iteration -> save();

            return response() -> json(array(
                'id' => $iteration -> id,
                'ErrorStatus' => 0
            ), 201);
        }
    }


    /**
     * Delete iteration
     *
     * @param null $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteIteration($id = null)
    {
        if (!$id) {
            return response() -> json(array(
                'message' => 'Id is required',
                'ErrorStatus' => 13
            ));
        } else {
            // $user = User::find( $user_id );

            $iteration = Iteration::find($id);
            $iteration -> delete();
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

        $iterations = Iteration::where('author', 0)
            -> orderBy('id', 'desc')
            -> get();

        return response()->json( $iterations );
    }

}