<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Death;

class DeathController extends Controller
{
    public function topCauses(Request $request)
    {
        $year = $request->year;

        return Death::select('cause', DB::raw('SUM(deaths) as total'))
            ->when($year, fn($q) => $q->where('year', $year))
            ->groupBy('cause')
            ->orderByDesc('total')
            ->limit(10)
            ->get();
    }
    public function trends(Request $request)
    {
        return Death::select(
                'year',
                'cause',
                DB::raw('SUM(deaths) as total')
            )
            ->groupBy('year', 'cause')
            ->orderBy('year')
            ->get();
    }
    public function map(Request $request)
    {
        return Death::select(
                'country',
                DB::raw('SUM(deaths) as total')
            )
            ->when($request->year, fn($q) => $q->where('year', $request->year))
            ->when($request->cause, fn($q) => $q->where('cause', $request->cause))
            ->groupBy('country')
            ->get();
    }
    public function compareCountries(Request $request)
    {
        $countries = $request->countries;

        return Death::select(
                'year',
                'country',
                DB::raw('SUM(deaths) as total')
            )
            ->whereIn('country', $countries ?? [])
            ->groupBy('year', 'country')
            ->orderBy('year')
            ->get();
    }
    public function distribution(Request $request)
    {
        return Death::select(
                'cause',
                DB::raw('SUM(deaths) as total')
            )
            ->when($request->year, fn($q) => $q->where('year', $request->year))
            ->groupBy('cause')
            ->get();
    }
    public function filters()
    {
        return [
            'years' => Death::select('year')->distinct()->orderBy('year')->pluck('year'),
            'countries' => Death::select('country')->distinct()->orderBy('country')->pluck('country'),
            'causes' => Death::select('cause')->distinct()->orderBy('cause')->pluck('cause'),
        ];
    }
}
