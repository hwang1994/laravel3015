<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\IndexController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ItemController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/token', [IndexController::class, 'token']);
Route::get('/islogin', [IndexController::class, 'islogin']);
Route::get('/logout', [IndexController::class, 'logout']);
Route::get('/unpinned', [ItemController::class, 'unpinnedItems']);
Route::get('/pinned', [ItemController::class, 'pinnedItems'])->middleware('auth:profile');
Route::get('/recentlyviewed', [ItemController::class, 'recentlyViewed']);
Route::get('/getitem', [ProductController::class, 'getItem']);

Route::view('{path?}', 'welcome')->name('home'); 

Route::post('/signup', [LoginController::class, 'signup']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/newitem', [ItemController::class, 'createItem'])->middleware('auth:profile');
Route::post('/pin', [ItemController::class, 'pinItem'])->middleware('auth:profile');
Route::delete('/pin', [ItemController::class, 'unpinItem'])->middleware('auth:profile');
Route::delete('/item', [ItemController::class, 'deleteItemByRequest'])->middleware('auth:profile');
Route::post('/downvote', [ItemController::class, 'downvoteItem'])->middleware('auth:profile');