<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Death;

class DeathController extends Controller
{
    private function applyFilters($query, $request)
    {
        return $query
            ->when($request->year, fn($q) => $q->where('year', $request->year))

            ->when($request->country, function ($q) use ($request) {
                return is_array($request->country)
                    ? $q->whereIn('country', $request->country)
                    : $q->where('country', $request->country);
            })

            ->when($request->cause, function ($q) use ($request) {
                return is_array($request->cause)
                    ? $q->whereIn('cause', $request->cause)
                    : $q->where('cause', $request->cause);
            });
    }

    public function topCauses(Request $request)
    {
        $query = Death::select('cause', DB::raw('SUM(deaths) as total'));

        $this->applyFilters($query, $request);

        return $query
            ->groupBy('cause')
            ->orderByDesc('total')
            ->limit(10)
            ->get();
    }

    public function trends(Request $request)
    {
        $query = Death::select(
            'year',
            'cause',
            DB::raw('SUM(deaths) as total')
        );

        $this->applyFilters($query, $request);

        return $query
            ->groupBy('year', 'cause')
            ->orderBy('year')
            ->get();
    }

    public function map(Request $request)
    {
        $query = Death::select(
            'country',
            DB::raw('SUM(deaths) as total')
        );

        $this->applyFilters($query, $request);

        return $query
            ->groupBy('country')
            ->get();
    }

    public function compareCountries(Request $request)
    {
        return Death::select(
                'year',
                'country',
                DB::raw('SUM(deaths) as total')
            )
            ->when($request->countries, fn($q) => $q->whereIn('country', $request->countries))
            ->groupBy('year', 'country')
            ->orderBy('year')
            ->get();
    }

    public function distribution(Request $request)
    {
        $query = Death::select(
            'cause',
            DB::raw('SUM(deaths) as total')
        );

        $this->applyFilters($query, $request);

        return $query
            ->groupBy('cause')
            ->get();
    }

    public function filters()
    {
        return [
            'years' => Death::select('year')
                ->distinct()
                ->orderBy('year')
                ->pluck('year'),

            'countries' => Death::select('country')
                ->distinct()
                ->orderBy('country')
                ->pluck('country'),

            // ✅ FIXED: causes with counts
            'causes' => Death::select(
                    'cause as name',
                    DB::raw('SUM(deaths) as count')
                )
                ->groupBy('cause')
                ->orderByDesc('count')
                ->get(),
        ];
    }
}