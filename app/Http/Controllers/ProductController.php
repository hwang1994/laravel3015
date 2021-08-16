<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Profile;
use App\Models\Downvote;
use App\Models\Item;
use App\Models\Pin;

use Illuminate\Http\Request;
use League\OAuth2\Client\Provider\GenericProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Cookie;

class ProductController extends Controller
{
    public function getItem(Request $request)
    {
        $itemId = $request->input('id');
        $item = Item::where('id', $itemId)->first();
        $item['email'] = $item->user->email;
        $item['name'] = $item->user->name;
        if ($item!==null) {
            if ($request->hasCookie('recently_viewed')) {
                $cookie = $request->cookie('recently_viewed');
                $pieces = preg_split("/\|/", $cookie);
                $exist=false;
                for($i = 0; $i < count($pieces); $i++){
                    if ($itemId==$pieces[$i]) {
                        $exist=true;
                    }
                }
                if (!$exist && count($pieces)<env('MAX_RECENTLY_VIEWED')) {
                    $data=$cookie.'|'.$itemId;
                    $cookie = Cookie::queue(Cookie::make('recently_viewed', $data, env('ITEM_LIFE_MINUTES')));
                }
                else if (!$exist && count($pieces)>=env('MAX_RECENTLY_VIEWED')) {
                    $data=$pieces[1].'|'.$pieces[2].'|'.$pieces[3].'|'.$itemId;
                    $cookie = Cookie::queue(Cookie::make('recently_viewed', $data, env('ITEM_LIFE_MINUTES')));
                }
                //var_dump($data);
            }
            else {
                $cookie = Cookie::queue(Cookie::make('recently_viewed', $itemId, env('ITEM_LIFE_MINUTES')));
            }
        }
        return response()->json($item);
    }
}