<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\Downvote;
use App\Models\Item;
use App\Models\Pin;

use Illuminate\Http\Request;
use League\OAuth2\Client\Provider\GenericProvider;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    public function islogin()
    {
        $user = Auth::guard('profile')->user();
        if ($user!==null) {
            return response()->json(['status' => true, 'email' => $user->getAttribute('email')]);
        }
        else {
            return response()->json(['Not logged in']);
        }
    }

    public function logout()
    {
        Auth::guard('profile')->logout();

        //return view('welcome');

        return view('welcome', ['email' => null, 'loggedIn' => false]);
    }
}