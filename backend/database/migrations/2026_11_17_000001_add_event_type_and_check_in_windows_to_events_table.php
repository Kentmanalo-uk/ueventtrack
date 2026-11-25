<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->enum('event_type', ['full_day', 'morning_only', 'afternoon_only'])->default('full_day')->after('end_time');
            $table->time('check_in_start')->nullable()->after('event_type')->comment('Time when check-in opens');
            $table->time('check_in_end')->nullable()->after('check_in_start')->comment('Time when check-in closes');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['event_type', 'check_in_start', 'check_in_end']);
        });
    }
};
