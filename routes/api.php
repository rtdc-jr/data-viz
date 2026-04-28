<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DeathController;

Route::prefix('deaths')->group(function () {
    Route::get('/top-causes', [DeathController::class, 'topCauses']);
    Route::get('/trends', [DeathController::class, 'trends']);
    Route::get('/map', [DeathController::class, 'map']);
    Route::get('/compare', [DeathController::class, 'compareCountries']);
    Route::get('/distribution', [DeathController::class, 'distribution']);
    Route::get('/filters', [DeathController::class, 'filters']);
});