<?php namespace App\Http\Controllers;

use DB;
use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Metatag;

class SettingsController extends Controller {

    private $rules = array();

    /**
     * Create a new controller instance.
     *
     */
    public function __construct()
    {
        $this->middleware('cors');
    }

    /**
     *
     */
    public function getIndex()
    {
        // $user_id = Auth::id();
        // if ( ! $user_id ) return response() -> json( $this -> AUTH_ERROR, 401 );

        $metatags = Metatag::all();
        $settings = array(
            'metatags' => array()
        );

        foreach ($metatags as $tag) {
            if (! array_key_exists($tag['category'], $settings['metatags'])) {
                $settings['metatags'][$tag['category']] = array();
            }
            array_push(
                $settings['metatags'][$tag['category']],
                (object) array(
                    'id' => $tag['id'],
                    'name' => $tag['name']
                ));
        }

        return response()->json( $settings );
    }

}