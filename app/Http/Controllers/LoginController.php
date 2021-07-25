<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\Downvote;
use App\Models\Item;
use App\Models\Pin;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{

    public function login(Request $request)
    {
        // $request->validate([
        //     'firstname'  => ['required', 'regex:/^[a-z]([a-z]|\'|-)*([a-z]|\')$/i'],
        //     'lastname'  => ['required', 'regex:/^[a-z]([a-z]|\'|-)*([a-z]|\')$/i'],
        //     'email'=>['required', 'email'],
        //     'password'  => ['required', 'confirmed',Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised()]
        // ]);

        $allParams  = $request->all();
        $email = $allParams['email'];
        $password = $allParams['password'];
        $user = User::all()->where('email',$email)->pop();
        
        if ($user !== null && Hash::check($password, $user->password)) {
            Auth::guard('profile')->login($user, true);
            return response()->json(['Logged In!']);
        }
        else {
            return response()->json(['Email not found or incorrect password!']);
        }
    }

    public function signup(Request $request)
    {
        $request->validate([
            'firstname'  => ['required', 'regex:/^[a-z]([a-z]|\'|-)*([a-z]|\')$/i'],
            'lastname'  => ['required', 'regex:/^[a-z]([a-z]|\'|-)*([a-z]|\')$/i'],
            'email'=>['required', 'email'],
            'password'  => ['required', 'confirmed',Password::min(8)->letters()->mixedCase()->numbers()->symbols()->uncompromised()]
        ]);

        $allParams  = $request->all();
        $email = $allParams['email'];
        $user = User::all()->where('email',$email)->pop();
        
        if ($user === null) {
            $user = new User();
            $user->name = ucwords(trim($allParams['firstname']).' '.trim($allParams['lastname']));
            $user->email = $allParams['email'];
            $user->password = Hash::make($allParams['password']);
            $user->save();
            Auth::guard('profile')->login($user, true);
            return response()->json(['Signed Up!']);
        }
        else {
            return response()->json(['Email is already signed up!']);
        }
    }

}
