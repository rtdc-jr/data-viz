<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use League\Csv\Reader;
use Illuminate\Support\Facades\DB;

class DeathSeeder extends Seeder
{
    public function run(): void
    {
        $csv = Reader::createFromPath(
            base_path('public/data/cause_of_death.csv'),
            'r'
        );

        $csv->setHeaderOffset(0);

        $batch = [];
        $batchSize = 1000;
        $count = 0;

        foreach ($csv as $row) {

            // ✅ Correct column names
            if (
                empty($row['Entity']) ||
                empty($row['Year']) ||
                empty($row['Death Numbers'])
            ) {
                continue;
            }

            $batch[] = [
                'country' => trim($row['Entity']),
                'year' => (int) $row['Year'],
                'cause' => trim($row['Causes name']), // ✅ FIXED
                'deaths' => (int) $row['Death Numbers'], // ✅ FIXED
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $count++;

            if (count($batch) === $batchSize) {
                DB::table('deaths')->insert($batch);
                $batch = [];

                $this->command->info("Inserted: $count rows");
            }
        }

        if (!empty($batch)) {
            DB::table('deaths')->insert($batch);
        }

        $this->command->info("✅ Import complete. Total rows: $count");
    }
}