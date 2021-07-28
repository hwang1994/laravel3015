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

class ProfileController extends Controller
{
    public function createItem(Request $request)
    {
        $request->validate([
            'title'  => ['required', 'regex:/^([a-z]|[0-9])([a-z]|[0-9]|\'|-| )*([a-z]|[0-9]|\')$/i'],
            'price' => ['required', 'regex:/^[0-9][0-9]*\.?[0-9]{0,2}$/i'],
            'description' => ['required', 'not_regex:/(?=.*[<>|])/'],
            'file'       => ['required', 'image' , 'max:4000']
        ]);

        $allParams  = $request->all();
        $user   = Auth::user();
        $email = $user->getAttribute('email');
        $id = $user->getAttribute('id');
        $pictureName = md5($email.time());

        $path = $request->file('file')->storeAs('public/pictures', $pictureName);
        $item = new Item();
        $item->user_id = $id;
        $item->title = $allParams['title'];       
        $item->price = number_format((float)$allParams['price'], 2, '.', '');
        $item->description = $allParams['description'];
        $item->picture = $pictureName;
        $item->save();


        return response()->json(['Item Uploaded']);
    }

    public function pinItem(Request $request)
    {
        $user   = Auth::user();
        $userId = $user->getAttribute('id');
        $itemId = $request->input('pin');
        $item = Item::find($itemId);
        if ($user !==null && $item!==null) {
            $pinned = Pin::where([['user_id','=',$userId],['item_id','=', $itemId]])->first();
            if ($pinned === null) {
                $pin = new Pin();
                $pin->user_id = $userId;
                $pin->item_id = $itemId;
                $pin->save();
                return response()->json(['Item Pinned']);
            }   
            else {
                return response()->json(['Item already pinned by user']);
            }
        }
        else {
            return response()->json(['Item does not exist or user not logged in! Pin Failed']);
        }
    }

    public function unpinItem(Request $request)
    {
        $user   = Auth::user();
        $userId = $user->getAttribute('id');
        $itemId = $request->input('unpin');
        if ($user !==null) {
            $pin = Pin::where([['user_id','=',$userId],['item_id','=', $itemId]])->first();
            if ($pin !== null && $pin['user_id'] == $userId) {
                $pin->delete();
                return response()->json(['Item unPinned']);
            }
            else {
                return response()->json(['Pinned Item does not exist! unpin Failed']);
            }
        }
        else {
            return response()->json(['User not logged in']);
        }
    }

    public function downvoteItem(Request $request)
    {
        $user   = Auth::user();
        $userId = $user->getAttribute('id');
        $itemId = $request->input('downvote');
        $item = Item::find($itemId);
        if ($user !==null && $item!==null) {
            $downVoted = Downvote::where([['user_id','=',$userId],['item_id','=', $itemId]])->first();
            if ($downVoted === null) { //item not downvoted by user
                $downVote = new Downvote();
                $downVote->user_id = $userId;
                $downVote->item_id = $itemId;
                $downVote->save();
                $itemDownvotes = Downvote::where('item_id', '=', $itemId)->count(); 
                if ($itemDownvotes >= env('MAX_DOWNVOTES')) {
                    $pictureFile = $item['picture'];
                    $this->deleteItemById($itemId, $pictureFile);
                    return response()->json(['Downvoted! Now Deleted to due too many downvotes']);
                }
                else {
                    return response()->json(['Downvoted!']);
                }
            }
            else {
                return response()->json(['No downvoting more than once on same product!']);
            }
        }
        else {
            return response()->json(['User not logged in or item does not exist']);
        }
    }

    public function deleteItemByRequest(Request $request)
    {
        $user   = Auth::user();
        $userId = $user->getAttribute('id');
        $itemId = $request->input('delete');
        $item = Item::find($itemId);
        $pictureFile = $item['picture'];
        if ($item!==null && $item['user_id']==$userId) {
            $this->deleteItemById($itemId, $pictureFile);
            return response()->json(['Item deleted!']);
        }
        else {
            return response()->json(['Item does not exist! Delete Failed']);
        }
    }

    private function deleteItemById($itemId, $pictureFile)
    {
        Downvote::where('item_id', $itemId)->delete();
        Pin::where('item_id', $itemId)->delete();              
        Item::where('id', $itemId)->delete();
        unlink(public_path('storage/pictures/'.$pictureFile));
    }

    private function isPinnedByUser($itemId, $userId) {
        $result = false;
        $pins = Pin::where('item_id', $itemId)->get();       
        foreach ($pins as $pin) {
            if ($itemId==$pin['item_id'] && $userId==$pin['user_id']) {
                return true;
            }
        }
        return $result;
    }

    public function unpinnedItems(Request $request)
    {
        /** @var User $user */
        $user = Auth::guard('profile')->user();
        //$items = Item::all()->where('created_at', '>', Carbon::now()->subHours(1)->toDateTimeString());
        $items = Item::all();
        $unpinnedItems = [];
        if ($user!==null) {
            $userId = $user->getAttribute('id');
            if ($request->input('term') && trim($request->input('term'))!='') {
                $request->validate([
                    'term'  => ['not_regex:/(?=.*[<>|])/']
                ]);
                $term = $request->input('term');
                foreach ($items as $item) {
                    if (!$this->isPinnedByUser($item['id'], $userId)) {
                        if (preg_match('/'.$term.'/i', $item['title']) || preg_match('/'.$term.'/i', $item->user->name) || preg_match('/'.$term.'/i', $item['description']) || preg_match('/'.$term.'/i', $item['price']) ) {
                            $item['email'] = $item->user->email;
                            $item['name'] = $item->user->name;
                            $unpinnedItems[] = $item;
                        }
                    }
                }
            }
            else {
                foreach ($items as $item) {
                    if (!$this->isPinnedByUser($item['id'], $userId)) {
                        $item['email'] = $item->user->email;
                        $item['name'] = $item->user->name;
                        $unpinnedItems[] = $item;
                    }
                }
            }
        }
        else {
            if ($request->input('term') && trim($request->input('term'))!='') {               
                $request->validate([
                    'term'  => ['not_regex:/(?=.*[<>|])/']
                ]);
                $term = $request->input('term');
                foreach ($items as $item) {
                    if (preg_match('/'.$term.'/i', $item['title']) || preg_match('/'.$term.'/i', $item->user->name) || preg_match('/'.$term.'/i', $item['description']) || preg_match('/'.$term.'/i', $item['price']) ) {
                        $item['email'] = $item->user->email;
                        $item['name'] = $item->user->name;
                        $unpinnedItems[] = $item;
                    }
                }
            }
            else {
                foreach ($items as $item) {
                    $item['email'] = $item->user->email;
                    $item['name'] = $item->user->name;
                    $unpinnedItems[] = $item;
                }
            }
        }
        return response()->json($unpinnedItems);
    } 

    public function pinnedItems(Request $request) 
    {
        $pinnedItemByUser = [];
        /** @var User $user */
        $user = Auth::guard('profile')->user();
        if ($user!==null) {
            $pins = Pin::all();
            //$pins = Pin::all()->where('created_at', '>', Carbon::now()->subHours(1)->toDateTimeString())->where('user_id',$id);
            if ($request->input('term') && trim($request->input('term'))!='') {
                $request->validate([
                    'term'  => ['not_regex:/(?=.*[<>|])/']
                ]);
                $term = $request->input('term');
                foreach ($pins as $pin) {
                    if (preg_match('/'.$term.'/i', $pin->item->title) || preg_match('/'.$term.'/i', $pin->item->user->name) || preg_match('/'.$term.'/i', $pin->item->description) || preg_match('/'.$term.'/i', $pin->item->price) ) {
                        if ($pin['user_id'] == $user->getAttribute('id')) {
                            $pin['title'] = $pin->item->title;
                            $pin['name'] = $pin->item->user->name;
                            $pin['description'] = $pin->item->description;
                            $pin['price'] = $pin->item->price;
                            $pin['email'] = $pin->item->user->email;
                            $pin['picture'] = $pin->item->picture;
                            $pin['id'] = $pin->item_id;
                            $pinnedItemByUser[]=$pin;
                        }
                    }
                }
            }
            else {
                foreach ($pins as $pin) {
                    if ($pin['user_id'] == $user->getAttribute('id')) {
                        $pin['title'] = $pin->item->title;
                        $pin['name'] = $pin->item->user->name;
                        $pin['description'] = $pin->item->description;
                        $pin['price'] = $pin->item->price;
                        $pin['email'] = $pin->item->user->email;
                        $pin['picture'] = $pin->item->picture;
                        $pin['id'] = $pin->item_id;
                        $pinnedItemByUser[]=$pin;
                    }
                }
            }           
        }
        return response()->json($pinnedItemByUser);
    }

    public function recentlyViewed(Request $request) 
    {
        $recentlyViewedItems=[];
        if ($request->hasCookie('recently_viewed')) {
            $cookie = $request->cookie('recently_viewed');
            $pieces = preg_split("/\|/", $cookie);
            for($i = 0; $i < count($pieces); $i++){
                $item = Item::find($pieces[$i]);
                if ($item!==null) {
                    $item['email'] = $item->user->email;
                    $item['name'] = $item->user->name;
                    $recentlyViewedItems[]=$item; 
                }
            }
        }

        if (count($recentlyViewedItems)>1) {
            usort($recentlyViewedItems, array($this, "cmp"));
        }

        return response()->json($recentlyViewedItems);
    }

    public function cmp($a, $b)
    {
        if ($a['name']==$b['name'] && $a['price']==$b['price']) {
            return 0;
        }
        else if ($a['name']==$b['name'] && $a['price']<$b['price']) {
            return 1;
        }
        else if ($a['name']==$b['name'] && $a['price']>$b['price']) {
            return -1;
        }
        else {
            return strcmp($a['name'], $b['name']);
            //return strcmp($b['name'], $a['name']);
        }
    }
}