<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class MetatagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('metatags')
            ->insert([
                'name' => 'Major',
                'category' => 'priority'
            ]);
        DB::table('metatags')
            ->insert([
                'name' => 'Minor',
                'category' => 'priority'
            ]);
        DB::table('metatags')
            ->insert([
                'name' => 'Critical',
                'category' => 'priority'
            ]);
        DB::table('metatags')
            ->insert([
                'name' => 'ToDo',
                'category' => 'status'
            ]);
        DB::table('metatags')
            ->insert([
                'name' => 'In Process',
                'category' => 'status'
            ]);
        DB::table('metatags')
            ->insert([
                'name' => 'Panding',
                'category' => 'status'
            ]);
        DB::table('metatags')
            ->insert([
                'name' => 'Done',
                'category' => 'status'
            ]);
        DB::table('metatags')
            ->insert([
                'name' => 'Closed',
                'category' => 'status'
            ]);
    }
}
