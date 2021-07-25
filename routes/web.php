<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\IndexController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
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

Route::get('/islogin', [IndexController::class, 'islogin']);
Route::get('/logout', [IndexController::class, 'logout']);
Route::get('/unpinned', [ProfileController::class, 'unpinnedItems']);
Route::get('/pinned', [ProfileController::class, 'pinnedItems'])->middleware('auth:profile');
Route::get('/pin', [ProfileController::class, 'pinItem'])->middleware('auth:profile');
Route::get('/unpin', [ProfileController::class, 'unpinItem'])->middleware('auth:profile');
Route::get('/delete', [ProfileController::class, 'deleteItemByRequest'])->middleware('auth:profile');
Route::get('/downvote', [ProfileController::class, 'downvoteItem'])->middleware('auth:profile');
Route::get('/recentlyviewed', [ProfileController::class, 'recentlyViewed']);
Route::get('/getitem', [ProductController::class, 'getItem']);

Route::view('{path?}', 'welcome')->name('home'); 

Route::post('/signup', [LoginController::class, 'signup']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/newitem', [ProfileController::class, 'createItem'])->middleware('auth:profile');

