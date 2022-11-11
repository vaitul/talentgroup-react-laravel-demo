<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Movies;
use App\Models\Poster;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Config;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/fetch-movies/{button_id}', function ($button_id) {

    $query = $button_id == 1
        ? "?s=Matrix&apikey=720c3666"
        : ($button_id == 2
            ? "?s=Matrix%20Reloaded&apikey=720c3666"
            : ($button_id == 3
                ? "?s=Matrix%20Revolutions&apikey=720c3666"
                : ""));

    if ($query == "") {
        return json_encode([]);
    }

    $client = new GuzzleHttp\Client([
        'base_uri' => 'http://www.omdbapi.com/'
    ]);
    
    $response = $client->request('GET', $query);
    $data = json_decode($response->getBody()->getContents());
    $savedRec = [];
    foreach ($data->Search as $value) {
        $record = Movies::where('title', "=", $value->Title)->first();
        if (isset($record->id) == 0) {
            $poster_id = null;
            if (isset($value->Poster)) {
                $poster_id = Poster::create([
                    'url' => $value->Poster
                ])->id;
            }
            $record = Movies::create([
                "title" => $value->Title,
                "year" => $value->Year,
                "imdb_id" => $value->imdbID,
                "type" => $value->Type,
                "poster_id" => $poster_id
            ]);
        }
        $record->poster = $value->Poster;
        array_push($savedRec, $record);
    }
    return $savedRec;
});